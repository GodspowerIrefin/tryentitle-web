/**
 * Magnetic hover.
 *
 * An element marked `data-magnetic` leans toward the pointer while the pointer
 * is near it, then springs back on leave. It is the one piece of pure charm in
 * the motion layer, so it is kept on a short leash: a few pixels of travel, only
 * on the primary CTAs, and only where a real pointer exists.
 *
 * GATES — all three must pass, or nothing is attached at all:
 *  - `prefers-reduced-motion: no-preference`
 *  - a fine, hovering pointer; on touch there is no hover state to key off and
 *    the element would simply lurch on tap
 *  - the element is not disabled
 *
 * The offset is written to `--magnet-x` / `--magnet-y` and motion.css composes
 * it into the element's transform, so this file never fights a component for
 * ownership of `transform` — which is what breaks a button that also has a
 * `:active` press state.
 *
 * Pointer tracking is per-element and only while hovered, so an idle page has
 * exactly one listener (`pointerenter`) per magnetic element and nothing else.
 */

/** Maximum travel, in px. Past ~10 the button stops feeling attached to the grid. */
const PULL = 6
/** How far outside its own box the element starts reacting, in px. */
const FIELD = 40

const attached = new WeakSet<HTMLElement>()

function enabled(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function bind(el: HTMLElement) {
  if (attached.has(el)) return
  attached.add(el)

  let raf = 0
  let rect: DOMRect | null = null

  const clear = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    rect = null
    el.style.removeProperty('--magnet-x')
    el.style.removeProperty('--magnet-y')
    el.removeAttribute('data-magnet-active')
  }

  const onMove = (event: PointerEvent) => {
    if (!rect) return
    // Coalesce to one write per frame: pointermove fires far faster than the
    // display refreshes, and each write is a style recalculation.
    if (raf) return
    const { clientX, clientY } = event
    raf = requestAnimationFrame(() => {
      raf = 0
      if (!rect) return

      // Offset from the element's centre, normalised to -1…1 across the field.
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (clientX - cx) / (rect.width / 2 + FIELD)
      const ny = (clientY - cy) / (rect.height / 2 + FIELD)

      el.style.setProperty('--magnet-x', `${(Math.max(-1, Math.min(1, nx)) * PULL).toFixed(2)}px`)
      el.style.setProperty('--magnet-y', `${(Math.max(-1, Math.min(1, ny)) * PULL).toFixed(2)}px`)
    })
  }

  el.addEventListener('pointerenter', (event) => {
    if ((el as HTMLButtonElement).disabled) return
    // Ignore emulated pointer events from a tap — those have no hover to end.
    if (event.pointerType === 'touch') return

    rect = el.getBoundingClientRect()
    el.setAttribute('data-magnet-active', '')
    el.addEventListener('pointermove', onMove)
  })

  el.addEventListener('pointerleave', () => {
    el.removeEventListener('pointermove', onMove)
    clear()
  })

  // A click can move focus and scroll the page out from under the cached rect;
  // dropping the offset on blur and click avoids a button stuck off-centre.
  el.addEventListener('blur', clear)
  el.addEventListener('click', clear)
}

/** Bind every `[data-magnetic]` in a subtree. Safe to call repeatedly. */
export function initMagnetic(root: ParentNode = document) {
  if (!enabled()) return
  for (const el of root.querySelectorAll<HTMLElement>('[data-magnetic]')) bind(el)
}
