/**
 * Line-mask headline reveal.
 *
 * A headline is split into its VISUAL lines — the lines the browser actually
 * broke, not words or characters — and each line is wrapped in an
 * `overflow: hidden` mask with an inner span that slides up from beneath it.
 * Lines arrive in sequence, so a three-line headline reads as it assembles.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY MASKS AND NOT OPACITY
 *
 * The site's accessibility gate forbids fading text (see globals.css): a
 * contrast checker computes the BLENDED colour of a partially transparent
 * element, so every fading heading reports a failure, and anything below the
 * fold sits at `opacity: 0` until scrolled to — a permanent violation in that
 * state, not a transient one.
 *
 * A mask has no such problem. Text is at full opacity at every instant; it is
 * simply outside the clip until it slides in. Same effect, no exemption needed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE ACCESSIBLE TEXT IS RESTORED
 *
 * Splitting inserts a wrapper per line, which turns one continuous string into
 * several boxes. Screen readers can announce that as separate fragments, and
 * text selection and Ctrl+F break across the boundaries. So the original string
 * is preserved as the element's `aria-label` and the split output is marked
 * `aria-hidden` — assistive tech reads the whole headline once, exactly as
 * authored, while the eye gets the animation.
 *
 * If this module never runs the heading is left completely untouched, fully
 * visible and fully readable. The animation is additive, never load-bearing.
 */

/** Marks a heading that has already been processed, so re-scans are cheap. */
const DONE = 'data-split-done'
/** Per-line stagger. Long enough to read as a sequence, short enough to feel quick. */
const LINE_STAGGER_MS = 90

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Group an element's text into visual lines.
 *
 * Every word is temporarily wrapped in an inline span, then grouped by the
 * `offsetTop` the browser reports — which is the only reliable way to learn
 * where the real line breaks fell, since they depend on the final font, the
 * container width, and `text-wrap: balance`.
 *
 * Returns `null` for anything that is not a flat run of text (a headline
 * containing a `<br>`, a link, or a nested element), because reflowing those
 * would lose the markup. Those headings keep the plain rise instead.
 */
function toLines(el: HTMLElement): string[] | null {
  for (const node of el.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE) return null
  }

  const original = el.textContent ?? ''
  const words = original.split(/\s+/).filter(Boolean)
  if (words.length === 0) return null

  // Measure: one span per word, so their offsets expose the line breaks.
  el.textContent = ''
  const probes: HTMLSpanElement[] = []
  for (const word of words) {
    const span = document.createElement('span')
    span.textContent = word
    span.style.display = 'inline-block'
    el.append(span, document.createTextNode(' '))
    probes.push(span)
  }

  /*
   * Group by the offsetTop the browser reports for each probe. A new line starts
   * whenever a word sits more than a pixel lower than the previous one — the
   * tolerance absorbs sub-pixel baseline differences between words that are in
   * fact on the same line.
   */
  const lines: string[] = []
  let currentTop: number | null = null
  probes.forEach((probe, i) => {
    const word = words[i] ?? ''
    const top = probe.offsetTop
    if (currentTop === null || top > currentTop + 1) {
      currentTop = top
      lines.push(word)
    } else {
      lines[lines.length - 1] += ` ${word}`
    }
  })

  // Restore immediately — the caller decides what the final DOM looks like, and
  // an early return must not leave the probes behind.
  el.textContent = original
  return lines.length > 0 ? lines : null
}

/**
 * Split one heading into masked lines.
 *
 * The element gets `data-split` so motion.css can drive it, and reveals when
 * `.is-split-in` is added — which `reveals.ts` does when it scrolls into view,
 * or the Hero does on mount.
 */
export function splitLines(el: HTMLElement): boolean {
  if (el.hasAttribute(DONE)) return true

  const original = (el.textContent ?? '').trim()
  const lines = toLines(el)
  if (!lines) return false

  el.setAttribute(DONE, '')
  // The whole headline, announced once, exactly as authored.
  el.setAttribute('aria-label', original)

  const fragment = document.createDocumentFragment()
  lines.forEach((line, index) => {
    const mask = document.createElement('span')
    mask.className = 'split-line'
    mask.setAttribute('aria-hidden', 'true')

    const inner = document.createElement('span')
    inner.className = 'split-line__inner'
    inner.style.setProperty('--line-delay', `${index * LINE_STAGGER_MS}ms`)
    inner.textContent = line

    mask.append(inner)
    fragment.append(mask)
  })

  el.textContent = ''
  el.append(fragment)
  el.setAttribute('data-split', '')

  /*
   * Reveals initialise BEFORE split (fonts may still be loading). If this heading
   * sits inside a block that has already fired `.reveal-shown`, the release pass
   * in `show()` has already run and will never run again — so open the masks
   * here. Without this, an above-the-fold services (or any) header stays clipped
   * forever and reads as missing/transparent text.
   */
  const host = el.closest('[data-reveal]') ?? el
  if (host.classList.contains('reveal-shown') || el.classList.contains('reveal-shown')) {
    el.classList.add('is-split-in')
  }

  return true
}

/**
 * Split every `[data-split-lines]` heading in a subtree.
 *
 * Deferred until webfonts are ready: measuring line breaks in the fallback face
 * and then swapping to Bricolage would split at the wrong words.
 */
export function initSplit(root: ParentNode = document) {
  if (typeof window === 'undefined' || reducedMotion()) return

  const run = () => {
    for (const el of root.querySelectorAll<HTMLElement>('[data-split-lines]')) splitLines(el)
  }

  if (document.fonts?.status === 'loaded') run()
  else void (document.fonts?.ready ?? Promise.resolve()).then(run)
}
