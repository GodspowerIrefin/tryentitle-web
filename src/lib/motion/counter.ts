/**
 * Count-up figures.
 *
 * An element marked `data-count="42"` ticks from 0 to its value the first time
 * it scrolls into view, then stops for good. Used on the stat figures, where a
 * number that lands rather than simply appearing is what makes it read as a
 * measurement.
 *
 * RULES THIS FOLLOWS
 *  - The final value is the ELEMENT'S OWN TEXT, authored in the markup. This
 *    module only animates toward what is already there, so with JS off, under
 *    reduced motion, or in the SSG'd HTML a crawler sees, the correct figure is
 *    present and final. Nothing here is the source of truth.
 *  - Prefix and suffix (currency marks, `+`, `%`, `hrs`) are preserved by
 *    animating only the numeric run inside the string.
 *  - `aria-hidden` is not used; instead the element carries the final text in
 *    `aria-label` during the count, so a screen reader announces the real figure
 *    once rather than narrating every intermediate frame of a live region.
 */

const DURATION_MS = 1100
const DONE = 'data-count-done'

/** Ease-out cubic: fast off the mark, settles gently onto the final digit. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Split "1,240+" into prefix "", digits "1,240", suffix "+".
 * Returns null when there is no numeric run to animate.
 */
function parse(text: string): { prefix: string; value: number; suffix: string; decimals: number } | null {
  const match = /-?[\d,]*\.?\d+/.exec(text)
  if (!match) return null

  const raw = match[0]
  const value = Number.parseFloat(raw.replace(/,/g, ''))
  if (!Number.isFinite(value)) return null

  const dot = raw.indexOf('.')
  return {
    prefix: text.slice(0, match.index),
    value,
    suffix: text.slice(match.index + raw.length),
    decimals: dot === -1 ? 0 : raw.length - dot - 1,
  }
}

/** Render with the same thousands grouping the authored figure used. */
function format(value: number, decimals: number, grouped: boolean): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  })
}

function run(el: HTMLElement) {
  if (el.hasAttribute(DONE)) return
  el.setAttribute(DONE, '')

  const final = (el.textContent ?? '').trim()
  const parsed = parse(final)
  if (!parsed) return

  const { prefix, value, suffix, decimals } = parsed
  const grouped = final.includes(',')

  // Announce the real figure, not the ticking one.
  el.setAttribute('aria-label', final)

  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION_MS)
    const current = value * easeOut(t)
    el.textContent = `${prefix}${format(current, decimals, grouped)}${suffix}`
    if (t < 1) requestAnimationFrame(step)
    // Restore the authored string verbatim, so grouping and any spacing the
    // formatter would not reproduce survive exactly as written.
    else el.textContent = final
  }
  requestAnimationFrame(step)
}

let observer: IntersectionObserver | null = null

/** Observe every `[data-count]` in a subtree. Safe to call repeatedly. */
export function initCounters(root: ParentNode = document) {
  if (typeof window === 'undefined') return
  // Under reduced motion the authored figure simply stands as rendered.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        observer?.unobserve(el)
        run(el)
      }
    },
    { threshold: 0.6 },
  )

  for (const el of root.querySelectorAll<HTMLElement>('[data-count]')) {
    if (!el.hasAttribute(DONE)) observer.observe(el)
  }
}
