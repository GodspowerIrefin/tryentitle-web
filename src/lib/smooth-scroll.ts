/**
 * Eased wheel scrolling.
 *
 * Wheel deltas accumulate into a target and the page eases toward it each frame.
 * The REAL scroll position is what moves — `window.scrollTo`, not a transform on a
 * wrapper. That distinction is the whole reason this is safe here:
 *
 *  - `position: sticky` keeps working. A transform-based smooth-scroll wrapper
 *    creates a containing block and silently breaks every sticky element — which
 *    would take the pinned services band with it.
 *  - The native scrollbar, `Ctrl+F`, anchor links, and screen-reader "scroll to"
 *    all still operate on the document, because the document is still scrolling.
 *
 * DISABLED, deliberately, when:
 *  - `prefers-reduced-motion: reduce` — easing scroll is motion.
 *  - The pointer is coarse (touch). Mobile browsers have their own momentum and
 *    hijacking it feels broken and drops frames.
 *  - `SMOOTH_SCROLL` below is false. One flag, one place, if this proves
 *    unwelcome — it is the most opinionated interaction on the site.
 *
 * Keyboard scrolling (space, PageDown, arrows) and scrollbar dragging are NOT
 * intercepted; they keep native behaviour. Only the wheel is eased.
 */

/** Master switch. Set to false to restore fully native scrolling everywhere. */
export const SMOOTH_SCROLL = true

/** Proportion of the remaining distance covered per frame at 60fps. */
const EASE = 0.115
/** Below this many pixels, snap and stop — avoids a long asymptotic crawl. */
const SNAP = 0.5

let target = 0
let running = false
let raf = 0
let attached = false
/** Timestamp of the last wheel event, used to resync after native scrolling. */
let lastWheel = 0

function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

/**
 * True if the event happened inside an element that can itself scroll vertically.
 * Those need their native behaviour — a `<pre>` code block or an overflow panel
 * must scroll its own content, not the page.
 */
function insideScrollable(start: EventTarget | null, delta: number): boolean {
  let el = start instanceof Element ? start : null
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el)
    const scrolls = /(auto|scroll|overlay)/.test(style.overflowY)
    if (scrolls && el.scrollHeight > el.clientHeight + 1) {
      const atTop = el.scrollTop <= 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
      // Only defer while it still has somewhere to go in this direction.
      if (!((delta < 0 && atTop) || (delta > 0 && atBottom))) return true
    }
    el = el.parentElement
  }
  return false
}

/** Normalise wheel deltas: browsers report lines or pages, not only pixels. */
function pixels(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * 16 // lines
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight // pages
  return event.deltaY
}

function tick() {
  const current = window.scrollY
  const distance = target - current

  if (Math.abs(distance) < SNAP) {
    window.scrollTo(0, target)
    running = false
    raf = 0
    return
  }

  window.scrollTo(0, current + distance * EASE)
  raf = requestAnimationFrame(tick)
}

function onWheel(event: WheelEvent) {
  // Let the browser handle pinch-zoom and modified wheel gestures.
  if (event.ctrlKey || event.metaKey || event.altKey) return

  const delta = pixels(event)
  if (!delta) return
  if (insideScrollable(event.target, delta)) return

  const now = performance.now()
  // Resync from the live position when a new gesture starts, so native scrolling
  // (keyboard, scrollbar drag, an anchor jump) in between is not fought.
  if (!running || now - lastWheel > 220) target = window.scrollY
  lastWheel = now

  target = Math.min(maxScroll(), Math.max(0, target + delta))

  event.preventDefault()
  if (!running) {
    running = true
    raf = requestAnimationFrame(tick)
  }
}

/** Abandon the eased target when something else takes over the scroll. */
function release() {
  running = false
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

export function initSmoothScroll() {
  if (typeof window === 'undefined' || attached || !SMOOTH_SCROLL) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  /*
   * Neutralise the CSS `scroll-behavior: smooth` from globals.css for our own
   * calls. Without this the browser eases every per-frame `scrollTo` we make, on
   * top of the easing here, and the result lags badly behind the wheel.
   *
   * Explicit `scrollTo({ behavior: 'smooth' })` callers — anchor jumps, the
   * services tab rail, skip-to-content — are unaffected: an explicit behavior
   * argument always wins over the CSS property.
   */
  document.documentElement.style.scrollBehavior = 'auto'

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', release, { passive: true })
  window.addEventListener('touchstart', release, { passive: true })
  attached = true
}
