/**
 * Motion layer — one entry point for every scroll and hover behaviour.
 *
 * `initMotion()` is called once on the client from main.ts; `refreshMotion()`
 * after a route change swaps the page markup. Nothing here is imported by a
 * component directly, so a page never has to know the motion system exists —
 * markup opts in with data attributes and CSS in motion.css does the rest.
 *
 * ORDER MATTERS on init:
 *   1. scroll   — the clock everything else reads from
 *   2. reveals  — arms hidden states before the first paint the visitor sees
 *   3. effects  — subscribes to the clock
 *   4. split / magnetic / counters — decoration, safe to arrive last
 *
 * Every module inside is independently guarded: each no-ops under
 * `prefers-reduced-motion`, each is SSR-safe, and each is written so that its
 * absence leaves a correct, fully readable static page. If any single one throws
 * the others still run, and the site is a working document either way — which is
 * why `initMotion` isolates them rather than running one long function.
 */

import { initScroll, refreshScroll } from './scroll'
import { initReveals, refreshReveals } from './reveals'
import { initEffects, scanEffects, measureEffects, pruneEffects } from './effects'
import { initSplit } from './split'
import { initMagnetic } from './magnetic'
import { initCounters } from './counter'

export { scrollToTarget, onScrollFrame, scrollState, SMOOTH_SCROLL } from './scroll'
export { initReveals, refreshReveals } from './reveals'

/** Run a step in isolation: one failure must not take the rest of the page down. */
function step(name: string, fn: () => void) {
  try {
    fn()
  } catch (error) {
    // Motion is additive. Report it and carry on rather than breaking the page.
    console.warn(`[motion] ${name} failed to initialise`, error)
  }
}

export function initMotion() {
  if (typeof window === 'undefined') return

  step('scroll', initScroll)
  step('reveals', initReveals)
  step('effects', initEffects)
  step('split', () => initSplit())
  step('magnetic', () => initMagnetic())
  step('counters', () => initCounters())
}

/**
 * Pick up the new page's markup after a route change.
 *
 * Deliberately does NOT tear the motion layer down: the scroll clock, the
 * observers, and their caches are all document-scoped and survive navigation.
 * Only the element registries need refreshing — plus a prune, so a long session
 * hopping between routes cannot accumulate detached nodes.
 */
export function refreshMotion() {
  if (typeof window === 'undefined') return

  step('prune', pruneEffects)
  step('reveals', refreshReveals)
  step('effects', () => {
    scanEffects()
    measureEffects()
  })
  step('split', () => initSplit())
  step('magnetic', () => initMagnetic())
  step('counters', () => initCounters())
  step('scroll', refreshScroll)
}
