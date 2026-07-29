/**
 * Scroll-linked effects — parallax, scrubbed progress, and sticky-pin scrub.
 *
 * The model is deliberately small: JS computes ONE number per element — how far
 * that element has travelled through the viewport — writes it to a CSS custom
 * property, and CSS decides what to do with it. No effect is described in
 * JavaScript, so a new treatment is a stylesheet change and never a rebuild of
 * this file.
 *
 * Per element, each frame:
 *   --enter  0 → 1   as the element rises from the bottom edge into full view
 *   --p      0 → 1   across its whole traverse (bottom edge → past the top edge)
 *   --parallax  a resolved pixel offset, for `data-parallax` only
 *
 * MARKUP
 *   data-parallax="0.18"   drift against the scroll; the number is the fraction
 *                          of a viewport travelled across the full traverse.
 *                          Negative values drift the other way.
 *   data-scrub             publish --enter/--p only; CSS does the rest.
 *   data-pin               make the element sticky and publish the PARENT's
 *                          traverse as --p, which is what a pinned panel wants
 *                          to scrub against.
 *
 * COST CONTROL
 *  - One shared rAF (`onScrollFrame`), never a listener per element.
 *  - An IntersectionObserver gates the set: only elements currently near the
 *    viewport are measured each frame. Off-screen elements cost nothing.
 *  - Geometry is cached and recomputed on resize / route change, not per frame,
 *    so the loop does no forced layout.
 *
 * REDUCED MOTION
 *  Nothing is observed and no property is written. Every effect in motion.css
 *  is authored so that its absence is the correct static rendering — a parallax
 *  layer with no `--parallax` sits exactly where the layout put it.
 */

import { onScrollFrame, type ScrollState } from './scroll'

const SELECTOR = '[data-parallax], [data-scrub], [data-pin]'

interface Tracked {
  el: HTMLElement
  /** Document offset of the element top, cached between layout changes. */
  top: number
  height: number
  /** Parallax travel in px across the full traverse; 0 when not a parallax layer. */
  travel: number
  /** True while near enough to the viewport to be worth measuring. */
  active: boolean
  /** Last written --p, to skip redundant style writes. */
  last: number
}

const tracked = new Map<HTMLElement, Tracked>()

let observer: IntersectionObserver | null = null
let unsubscribe: (() => void) | null = null
let started = false

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Cache an element's document geometry. Reads layout — never call per frame. */
function measure(entry: Tracked) {
  const rect = entry.el.getBoundingClientRect()
  entry.top = rect.top + window.scrollY
  entry.height = rect.height

  const speed = Number.parseFloat(entry.el.dataset.parallax ?? '')
  entry.travel = Number.isFinite(speed) ? speed * window.innerHeight : 0
}

/**
 * For a pinned element the useful progress is its STICKY PARENT's traverse: the
 * panel itself stops moving once it pins, so its own rect would flatline exactly
 * when the scrub is supposed to run.
 */
function geometryHost(el: HTMLElement): HTMLElement {
  return el.hasAttribute('data-pin') ? (el.parentElement ?? el) : el
}

function track(el: HTMLElement) {
  if (tracked.has(el)) return

  const entry: Tracked = { el, top: 0, height: 0, travel: 0, active: false, last: -1 }
  tracked.set(el, entry)

  // Measure the geometry host, but observe the element itself: an element is
  // worth updating when IT is near the viewport.
  const host = geometryHost(el)
  const rect = host.getBoundingClientRect()
  entry.top = rect.top + window.scrollY
  entry.height = rect.height
  const speed = Number.parseFloat(el.dataset.parallax ?? '')
  entry.travel = Number.isFinite(speed) ? speed * window.innerHeight : 0

  observer?.observe(el)
}

function update(scroll: ScrollState) {
  const { y, viewport } = scroll

  for (const entry of tracked.values()) {
    if (!entry.active) continue

    /*
     * Traverse progress: 0 the moment the element's top reaches the bottom edge
     * of the viewport, 1 once its bottom has passed the top edge. The span is
     * therefore viewport + height, which is the distance the page must scroll
     * for the element to cross completely.
     */
    const span = viewport + entry.height
    const travelled = y + viewport - entry.top
    const p = Math.min(1, Math.max(0, travelled / span))

    // Entry progress: 0 → 1 over the first viewport-worth of that traverse, so
    // an element is "fully entered" once it is properly on screen rather than
    // only when it is about to leave.
    const enterSpan = Math.min(viewport, entry.height + viewport * 0.35)
    const enter = Math.min(1, Math.max(0, travelled / enterSpan))

    // Sub-pixel churn is invisible and every write costs a style recalculation.
    if (Math.abs(p - entry.last) < 0.0005) continue
    entry.last = p

    const style = entry.el.style
    style.setProperty('--p', p.toFixed(4))
    style.setProperty('--enter', enter.toFixed(4))

    if (entry.travel !== 0) {
      // Centre the drift on the midpoint of the traverse so the layer sits at
      // its authored position when the element is centred in the viewport.
      style.setProperty('--parallax', `${((p - 0.5) * entry.travel).toFixed(2)}px`)
    }
  }
}

/** Re-measure everything. Call after layout changes, not on a timer. */
export function measureEffects() {
  if (!started) return
  for (const entry of tracked.values()) {
    const host = geometryHost(entry.el)
    const rect = host.getBoundingClientRect()
    entry.top = rect.top + window.scrollY
    entry.height = rect.height
    const speed = Number.parseFloat(entry.el.dataset.parallax ?? '')
    entry.travel = Number.isFinite(speed) ? speed * window.innerHeight : 0
    entry.last = -1
  }
}

/** Pick up effect targets in newly rendered markup. Safe to call repeatedly. */
export function scanEffects(root: ParentNode = document) {
  if (!started) return
  for (const el of root.querySelectorAll<HTMLElement>(SELECTOR)) track(el)
}

/** Drop elements that have left the document, so a long session cannot leak. */
export function pruneEffects() {
  for (const [el, entry] of tracked) {
    if (!el.isConnected) {
      observer?.unobserve(el)
      tracked.delete(el)
      void entry
    }
  }
}

export function initEffects() {
  if (typeof window === 'undefined' || started) return
  if (reducedMotion()) return

  started = true

  observer = new IntersectionObserver(
    (entries) => {
      for (const record of entries) {
        const entry = tracked.get(record.target as HTMLElement)
        if (!entry) continue
        entry.active = record.isIntersecting
        // Re-measure on activation: anything above it may have changed height
        // (an accordion opened, an image finally laid out) since it was cached.
        if (record.isIntersecting) measure(entry)
      }
    },
    // A generous margin so an element is already being driven before it appears,
    // and keeps being driven just past the edge — no visible snap at either end.
    { rootMargin: '25% 0px 25% 0px' },
  )

  scanEffects()
  unsubscribe = onScrollFrame(update)

  // Late layout shifts — webfonts swapping in, images resolving — move every
  // cached offset below them. Re-measure once things settle rather than
  // re-reading layout every frame.
  if (document.fonts?.ready) void document.fonts.ready.then(measureEffects)
  window.addEventListener('resize', measureEffects, { passive: true })
  window.addEventListener('load', measureEffects, { once: true })
}

export function destroyEffects() {
  unsubscribe?.()
  unsubscribe = null
  observer?.disconnect()
  observer = null
  tracked.clear()
  started = false
}
