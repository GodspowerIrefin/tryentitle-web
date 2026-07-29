/**
 * Scroll engine — eased scrolling plus the single rAF clock the rest of the
 * motion layer subscribes to.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE REAL SCROLL POSITION MOVES
 *
 * The fashionable implementation of smooth scroll locks the document at
 * `position: fixed` and translates a wrapper element. That is the one thing this
 * module refuses to do, because a transform on an ancestor creates a containing
 * block and silently kills every `position: sticky` descendant — which here
 * would take the pinned service band, the process rail, and the sticky header
 * with it.
 *
 * Instead wheel and key deltas accumulate into a target and the page eases
 * toward it with `window.scrollTo`. The document genuinely scrolls, so sticky,
 * the native scrollbar, Ctrl+F, anchor links and screen-reader "scroll to" all
 * keep working. The easing is the only thing that is synthetic.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE CLOCK
 *
 * Everything scroll-linked on the site (parallax, scrubbed pins, the header
 * progress line) reads from ONE loop published here rather than each attaching
 * its own scroll listener. Two reasons: N listeners each doing their own layout
 * reads is how a marketing page ends up janky, and a shared frame guarantees the
 * header line and the parallax agree about where the page is on any given frame.
 *
 * The loop is not always running. It wakes on scroll input and idles out a beat
 * after motion settles, so a parked tab costs nothing.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DISABLED, deliberately:
 *  - `prefers-reduced-motion: reduce` — easing scroll is motion. Subscribers
 *    still receive state (so parallax can resolve to its neutral position and
 *    progress bars still track), but no input is intercepted.
 *  - Coarse pointers. Mobile browsers own momentum scrolling and hijacking the
 *    wheel there drops frames and feels broken.
 */

/** Master switch. `false` restores fully native scrolling everywhere. */
export const SMOOTH_SCROLL = true

/** Proportion of the remaining distance covered per frame at 60fps. */
const EASE = 0.115
/** Below this many pixels, snap and stop — avoids a long asymptotic crawl. */
const SNAP = 0.5
/** Keep the clock alive this long after the last scroll, so easing can settle. */
const IDLE_MS = 220
/** Pixels moved by one arrow-key press. Page keys use the viewport instead. */
const KEY_STEP = 90

/** What subscribers receive each frame. */
export interface ScrollState {
  /** Current scroll offset in px. */
  y: number
  /** Document progress, 0 at the top and 1 at the last scrollable pixel. */
  progress: number
  /** Pixels moved since the previous published frame. */
  velocity: number
  /** 1 scrolling down, -1 scrolling up, 0 at rest. */
  direction: 1 | -1 | 0
  /** Viewport height, cached so subscribers never read layout themselves. */
  viewport: number
}

type Subscriber = (state: ScrollState) => void

const subscribers = new Set<Subscriber>()

const state: ScrollState = {
  y: 0,
  progress: 0,
  velocity: 0,
  direction: 0,
  viewport: 0,
}

/** Eased target position. Only meaningful while `easing` is true. */
let target = 0
/** True while the engine is driving the scroll position itself. */
let easing = false
let raf = 0
let attached = false
let lastInput = 0
let lastY = 0
/** Set by the reduced-motion / coarse-pointer checks in `initScroll`. */
let interceptInput = false

function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

/**
 * True if the event started inside an element that can itself scroll vertically
 * and still has somewhere to go in this direction. Those keep native behaviour —
 * an overflow panel must scroll its own content, not the page.
 */
function insideScrollable(start: EventTarget | null, delta: number): boolean {
  let el = start instanceof Element ? start : null
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el)
    if (/(auto|scroll|overlay)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      const atTop = el.scrollTop <= 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
      if (!((delta < 0 && atTop) || (delta > 0 && atBottom))) return true
    }
    el = el.parentElement
  }
  return false
}

/** Normalise wheel deltas: browsers report lines or pages, not only pixels. */
function wheelPixels(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * 16 // lines
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight // pages
  return event.deltaY
}

function publish() {
  const y = window.scrollY
  const limit = maxScroll()

  state.velocity = y - lastY
  // Hold the last real direction while at rest so a subscriber that only cares
  // about "which way was the visitor going" is not reset by every idle frame.
  if (state.velocity > 0.5) state.direction = 1
  else if (state.velocity < -0.5) state.direction = -1

  state.y = y
  // Guard the divide: a page shorter than the viewport has nothing to progress
  // through, and 0/0 would put NaN into every subscriber's style binding.
  state.progress = limit > 0 ? Math.min(1, Math.max(0, y / limit)) : 0
  state.viewport = window.innerHeight
  lastY = y

  for (const fn of subscribers) fn(state)
}

function tick() {
  if (easing) {
    const current = window.scrollY
    const distance = target - current

    if (Math.abs(distance) < SNAP) {
      window.scrollTo(0, target)
      easing = false
    } else {
      window.scrollTo(0, current + distance * EASE)
    }
  }

  publish()

  // Keep running while the engine is still easing, or while native scrolling is
  // recent enough that subscribers likely still have work to do.
  if (easing || performance.now() - lastInput < IDLE_MS) {
    raf = requestAnimationFrame(tick)
  } else {
    // One final settled frame so parallax lands exactly on its resting value
    // rather than wherever the loop happened to stop.
    state.velocity = 0
    for (const fn of subscribers) fn(state)
    raf = 0
  }
}

/** Start (or extend) the clock. Cheap to call on every scroll event. */
function wake() {
  lastInput = performance.now()
  if (!raf) raf = requestAnimationFrame(tick)
}

/** Begin easing toward an absolute document offset. */
function easeTo(next: number) {
  target = Math.min(maxScroll(), Math.max(0, next))
  easing = true
  wake()
}

/** Resync the eased target from the live position when a new gesture starts. */
function resync() {
  if (!easing || performance.now() - lastInput > IDLE_MS) target = window.scrollY
}

function onWheel(event: WheelEvent) {
  // Let the browser own pinch-zoom and modified wheel gestures.
  if (event.ctrlKey || event.metaKey || event.altKey) return

  const delta = wheelPixels(event)
  if (!delta) return
  if (insideScrollable(event.target, delta)) return

  resync()
  event.preventDefault()
  easeTo(target + delta)
}

/**
 * Ease keyboard scrolling too, so a PageDown and a wheel flick feel like the
 * same page.
 *
 * Only the keys that mean "scroll the document" are taken, and only when focus
 * is not in a field or a scrollable panel — Space in a textarea types a space,
 * and arrow keys in a select change the value.
 */
function onKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) return

  const el = document.activeElement
  if (el instanceof HTMLElement) {
    const tag = el.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) return
  }

  const viewport = window.innerHeight
  let delta: number | null = null
  let absolute: number | null = null

  switch (event.key) {
    case 'ArrowDown':
      delta = KEY_STEP
      break
    case 'ArrowUp':
      delta = -KEY_STEP
      break
    case 'PageDown':
      delta = viewport * 0.9
      break
    case 'PageUp':
      delta = -viewport * 0.9
      break
    case ' ':
      delta = event.shiftKey ? -viewport * 0.9 : viewport * 0.9
      break
    case 'Home':
      absolute = 0
      break
    case 'End':
      absolute = maxScroll()
      break
    default:
      return
  }

  if (delta !== null && insideScrollable(el, delta)) return

  resync()
  event.preventDefault()
  easeTo(absolute ?? target + (delta ?? 0))
}

/** Something else took the wheel — abandon the eased target and go native. */
function release() {
  easing = false
  wake()
}

/**
 * Scroll to an element or offset through the engine, so in-page anchors share
 * the same easing as the wheel instead of using a second, different curve.
 *
 * Falls back to the native smooth scroll when the engine is not intercepting
 * input (reduced motion, touch), which is the correct behaviour there anyway.
 */
export function scrollToTarget(to: Element | number, offset = 0) {
  if (typeof window === 'undefined') return

  const top =
    typeof to === 'number' ? to : to.getBoundingClientRect().top + window.scrollY - offset

  if (!interceptInput) {
    window.scrollTo({ top, behavior: 'smooth' })
    return
  }
  easeTo(top)
}

/**
 * Subscribe to the scroll clock. Returns an unsubscribe function.
 *
 * The subscriber is called once immediately with the current state so it can
 * paint a correct first frame without waiting for the visitor to scroll — which
 * matters on a reload partway down the page.
 */
export function onScrollFrame(fn: Subscriber): () => void {
  subscribers.add(fn)
  if (typeof window !== 'undefined') {
    state.viewport = window.innerHeight
    fn(state)
  }
  return () => {
    subscribers.delete(fn)
  }
}

/** Current state, for one-off reads outside a frame callback. */
export function scrollState(): Readonly<ScrollState> {
  return state
}

/** Force a frame — used after layout changes (route change, font load, resize). */
export function refreshScroll() {
  if (typeof window === 'undefined') return
  state.viewport = window.innerHeight
  wake()
}

export function initScroll() {
  if (typeof window === 'undefined' || attached) return
  attached = true

  lastY = window.scrollY
  state.viewport = window.innerHeight

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  interceptInput = SMOOTH_SCROLL && !reduced && fine

  // The clock runs regardless of whether input is intercepted: scroll-linked
  // effects still need frames under reduced motion, they simply resolve to their
  // neutral values.
  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('resize', refreshScroll, { passive: true })

  if (!interceptInput) {
    publish()
    return
  }

  /*
   * Neutralise the CSS `scroll-behavior: smooth` from globals.css for our own
   * calls. Without it the browser eases every per-frame `scrollTo` on top of the
   * easing here, and the result lags badly behind the wheel. Explicit
   * `scrollTo({ behavior: 'smooth' })` callers are unaffected — an explicit
   * behaviour argument always wins over the CSS property.
   */
  document.documentElement.style.scrollBehavior = 'auto'

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeydown, { passive: false })
  window.addEventListener('touchstart', release, { passive: true })
  window.addEventListener('mousedown', release, { passive: true })

  publish()
}
