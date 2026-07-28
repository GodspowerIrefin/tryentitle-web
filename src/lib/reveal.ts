/**
 * Scroll reveals (design spec §5): 16px rise + fade, 60ms stagger, fires ONCE.
 *
 * Implemented as one document-level IntersectionObserver rather than a Vue
 * directive per element, because:
 *  - Sections are server-rendered, so elements exist before any component
 *    mounts; a single observer can pick all of them up in one pass.
 *  - One observer for the whole page is materially cheaper than N observers.
 *  - `data-reveal` is inert markup. If this module never runs — JS disabled, an
 *    error earlier in the bundle — every element stays fully visible, because the
 *    hidden state is applied by JS, not by CSS. Content is never hidden by
 *    default waiting to be revealed.
 *
 * Stagger comes from the element's position among its reveal siblings, so a card
 * grid cascades without anyone hand-numbering the cards.
 */

const HIDDEN = 'reveal-hidden'
const SHOWN = 'reveal-shown'

let observer: IntersectionObserver | null = null

function prefersReducedMotion(): boolean {
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

  // Direction: `data-reveal="left"` enters from the left, `"right"` from the
  // right, anything else rises. Alternating rows use this so each half arrives
  // from the side it occupies.
  const dir = el.getAttribute('data-reveal')
  if (dir === 'left' || dir === 'right') el.classList.add(`reveal-${dir}`)

  // Cap the cascade: past ~6 items a per-item delay stops reading as a stagger
  // and starts reading as the page being slow.
  const delay = Math.min(staggerIndex(el), 6) * 60
  el.style.setProperty('--reveal-delay', `${delay}ms`)
  observer?.observe(el)
}

function scan(root: ParentNode = document) {
  for (const el of root.querySelectorAll<HTMLElement>('[data-reveal]')) arm(el)
}

/**
 * Start observing. Safe to call more than once — new elements are picked up and
 * already-revealed ones are left alone.
 */
export function initReveals() {
  if (typeof window === 'undefined') return

  // Under reduced motion nothing is ever hidden and no observer is created.
  if (prefersReducedMotion()) return

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        el.classList.remove(HIDDEN)
        el.classList.add(SHOWN)
        // Fires once: stop watching immediately so scrolling back up does not
        // replay the entrance.
        observer?.unobserve(el)
      }
    },
    // A little inside the fold, so the reveal reads as "arriving" rather than
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
