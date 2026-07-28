import type { Color } from 'three'
import type { ThreeModule } from './useThreeScene'

/**
 * Read a design token out of the live stylesheet and hand it to Three.js as a
 * Color.
 *
 * Scenes must not carry hex values (PRD §11.3 rule 5) — tokens.css is the only
 * file allowed to. Resolving through `getComputedStyle` means a palette change in
 * tokens.css reaches the 3D scene with no code change, and an unapproved colour
 * in a scene stays greppable.
 *
 * @param token Token name WITHOUT the leading dashes, e.g. `seal`.
 */
export function tokenColor(THREE: ThreeModule, token: string): Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim()
  if (!raw) {
    // A renamed token would otherwise surface as silent black geometry.
    console.warn(`[three] token --${token} not found in tokens.css`)
    return new THREE.Color(0x888888)
  }
  return new THREE.Color(raw)
}
