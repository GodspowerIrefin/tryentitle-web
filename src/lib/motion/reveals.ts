/**
 * Scroll reveals — the entrance every section uses.
 *
 * One document-level IntersectionObserver rather than a directive per element:
 *  - Sections are server-rendered, so elements exist before any component
 *    mounts; a single observer picks all of them up in one pass.
 *  - One observer for the whole page is materially cheaper than N observers.
 *  - `data-reveal` is inert markup. If this module never runs — JS disabled, an
 *    error earlier in the bundle — every element stays fully visible, because
 *    the hidden state is applied by JS, not CSS. Content is never hidden by
 *    default waiting to be released.
 *
 * Stagger comes from an element's position among its reveal siblings, so a card
 * grid cascades without anyone hand-numbering the cards.
 *
 * VARIANTS (`data-reveal="…"`)
 *   (empty)  16px rise
 *   left / right   enters from the side it occupies, for split rows
 *   mask     the block is wiped in behind a clip edge, for figures and panels
 *
 * Headings marked `data-split-lines` additionally get their masked lines
 * released here, so a headline and the copy beneath it share one trigger rather
 * than drifting apart on separate thresholds.
 *
 * TRANSFORM AND CLIP ONLY — never opacity. A contrast checker computes the
 * BLENDED colour of a partially transparent element, so a fading heading reports
 * a failure; and anything below the fold would sit at `opacity: 0` until
 * scrolled to, making that violation permanent for the state rather than
 * transient. A rise with no fade is indistinguishable at speed and keeps text at
 * full contrast at every instant.
 */

import { splitLines } from './split'

const HIDDEN = 'reveal-hidden'
const SHOWN = 'reveal-shown'
/** Cap the cascade: past ~6 items a per-item delay reads as the page being slow. */
const MAX_STAGGER = 6
const STAGGER_MS = 60

let observer: IntersectionObserver | null = null

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Index of `el` among the reveal targets sharing its parent. */
function staggerIndex(el: Element): number {
  const siblings = el.parentElement?.children
  if (!siblings) return 0
  let n = 0
  for (const sibling of siblings) {
    if (sibling === el) return n
    if (sibling.hasAttribute('data-reveal') || sibling.querySelector?.('[data-reveal]')) n++
  }
  return 0
}

function arm(el: HTMLElement) {
  if (el.classList.contains(HIDDEN) || el.classList.contains(SHOWN)) return
  el.classList.add(HIDDEN)

  const variant = el.getAttribute('data-reveal')
  if (variant === 'left' || variant === 'right' || variant === 'mask') {
    el.classList.add(`reveal-${variant}`)
  }

  el.style.setProperty('--reveal-delay', `${Math.min(staggerIndex(el), MAX_STAGGER) * STAGGER_MS}ms`)
  observer?.observe(el)
}

function show(el: HTMLElement) {
  el.classList.remove(HIDDEN)
  el.classList.add(SHOWN)

  // Release any masked headline inside this block on the same trigger.
  for (const heading of el.querySelectorAll<HTMLElement>('[data-split]')) {
    heading.classList.add('is-split-in')
  }
  if (el.hasAttribute('data-split')) el.classList.add('is-split-in')
}

function scan(root: ParentNode = document) {
  for (const el of root.querySelectorAll<HTMLElement>('[data-reveal]')) arm(el)

  /*
   * A masked headline that is NOT inside a `data-reveal` block still needs a
   * trigger of its own, or it would stay clipped forever. Split it now and let
   * the same observer release it.
   */
  for (const el of root.querySelectorAll<HTMLElement>('[data-split-lines]')) {
    if (el.closest('[data-reveal]')) continue
    if (el.classList.contains(SHOWN) || el.classList.contains(HIDDEN)) continue
    if (splitLines(el)) observer?.observe(el)
  }
}

/**
 * Start observing. Safe to call more than once — new elements are picked up and
 * already-revealed ones are left alone.
 */
export function initReveals() {
  if (typeof window === 'undefined') return
  // Under reduced motion nothing is hidden and no observer is created.
  if (reducedMotion()) return

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        show(el)
        // Fires once: stop watching immediately so scrolling back up does not
        // replay the entrance.
        observer?.unobserve(el)
      }
    },
    // A little inside the fold, so a reveal reads as "arriving" rather than
    // "already there".
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  )

  scan()
}

/** Re-scan after a route change brings new markup in. */
export function refreshReveals() {
  if (!observer) return
  scan()
}
