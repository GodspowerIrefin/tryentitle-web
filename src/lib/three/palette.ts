import type { Color } from 'three'

/**
 * Read Field & Brass token colours at runtime so Three.js materials stay bound
 * to the single source of truth in tokens.css (PRD §11.4) — no hex is duplicated
 * into the 3D code.
 */
export type TokenName =
  | 'color-ink-900'
  | 'color-ink-700'
  | 'color-graphite-500'
  | 'color-graphite-300'
  | 'color-rule'
  | 'color-paper'
  | 'color-surface'
  | 'color-signal-600'
  | 'color-signal-500'
  | 'color-brass-500'
  | 'color-brass-700'

export function tokenHex(name: TokenName): string {
  if (typeof window === 'undefined') return '#000000'
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim() || '#000000'
}

/** Build a THREE.Color from a token. Pass the THREE module so this stays lazy. */
export function tokenColor(THREE: typeof import('three'), name: TokenName): Color {
  return new THREE.Color(tokenHex(name))
}
