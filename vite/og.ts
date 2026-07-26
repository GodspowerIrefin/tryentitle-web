import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { SITE_NAME, SITE_TAGLINE } from '../src/lib/constants'

/**
 * Open Graph card generation (PRD FR5 / §11.7).
 *
 * Renders "a static branded card per section type" at build time, in the site's
 * own typography (Archivo + IBM Plex Mono) and palette. Never an AI-generated
 * image, never stock art — type, rules, and the brass exception mark only
 * (PRD §10.2, §10.8).
 *
 * Palette values are parsed from styles/tokens.css so this generator cannot
 * drift from the design tokens (PRD §11.4 single source of truth).
 */

const root = (p: string) => fileURLToPath(new URL(`../${p}`, import.meta.url))

/** Parse `--color-name: #hex;` declarations out of tokens.css. */
function loadPalette(): Record<string, string> {
  const css = readFileSync(root('src/styles/tokens.css'), 'utf-8')
  const palette: Record<string, string> = {}
  for (const [, name, hex] of css.matchAll(/--(color-[\w-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    palette[name!] = hex!
  }
  return palette
}

function font(pkg: string, file: string): Buffer {
  return readFileSync(root(`node_modules/${pkg}/files/${file}`))
}

interface CardSpec {
  /** Output filename without extension, e.g. "services". */
  name: string
  /** Mono eyebrow, uppercased in the card. */
  eyebrow: string
  /** The headline. */
  title: string
}

const CARDS: CardSpec[] = [
  { name: 'default', eyebrow: SITE_NAME, title: SITE_TAGLINE },
  { name: 'home', eyebrow: 'Operations, not software', title: SITE_TAGLINE },
  { name: 'services', eyebrow: 'Services', title: 'Six ways we take work off your desk.' },
  {
    name: 'industries',
    eyebrow: 'Industries',
    title: 'Built around the documents your field runs on.',
  },
  { name: 'blog', eyebrow: 'Blog', title: 'Notes on how work actually moves.' },
  { name: 'legal', eyebrow: 'Legal', title: `${SITE_NAME} legal documents` },
]

/** Build the satori element tree for one card. */
function cardElement(spec: CardSpec, c: Record<string, string>): Record<string, unknown> {
  const div = (style: Record<string, unknown>, children: unknown) => ({
    type: 'div',
    props: { style: { display: 'flex', ...style }, children },
  })

  return div(
    {
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: c['color-paper'],
      padding: '72px',
      fontFamily: 'IBM Plex Mono',
    },
    [
      // Eyebrow — mono, uppercase, wide tracking
      div(
        {
          fontSize: 24,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: c['color-graphite-500'],
        },
        spec.eyebrow.toUpperCase(),
      ),

      // Headline — Archivo, tight display setting
      div(
        {
          fontFamily: 'Archivo',
          fontSize: 68,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: c['color-ink-900'],
          maxWidth: '900px',
        },
        spec.title,
      ),

      // Footer rule: wordmark + the brass exception mark
      div(
        {
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `2px solid ${c['color-rule']}`,
          paddingTop: '28px',
        },
        [
          div(
            { alignItems: 'flex-end', gap: '6px' },
            [
              div(
                {
                  fontFamily: 'Archivo',
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: c['color-ink-900'],
                },
                SITE_NAME,
              ),
              div(
                {
                  width: '10px',
                  height: '10px',
                  backgroundColor: c['color-brass-500'],
                  marginBottom: '6px',
                },
                '',
              ),
            ],
          ),
          div(
            { fontSize: 22, letterSpacing: '0.12em', color: c['color-signal-600'] },
            'TRYENTITLE.COM',
          ),
        ],
      ),
    ],
  )
}

export async function generateOgImages(outDir: string): Promise<void> {
  const palette = loadPalette()
  const dir = path.join(outDir, 'og')
  mkdirSync(dir, { recursive: true })

  const fonts = [
    { name: 'Archivo', data: font('@fontsource/archivo', 'archivo-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
    { name: 'IBM Plex Mono', data: font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
  ]

  for (const spec of CARDS) {
    const svg = await satori(cardElement(spec, palette) as never, {
      width: 1200,
      height: 630,
      fonts,
    })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
    writeFileSync(path.join(dir, `${spec.name}.png`), png)
  }
}
