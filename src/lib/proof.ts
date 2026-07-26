/**
 * Proof collection access (PRD FR12 / §8.4).
 *
 * Reads every JSON file in `content/proof`. Empty collection → empty array →
 * ProofStrip renders nothing.
 *
 * Validation lives in the `proofGuard` build plugin (vite/proof.ts), not here:
 * an anonymous or unpermitted testimonial fails the BUILD, and the schema (and
 * zod with it) never reaches the browser. This module is a typed data lookup
 * only — the type import below is erased at compile time.
 */
import type { Testimonial } from '@/types/content'

export type { Testimonial }

// Eagerly imported at build time; the glob is empty until real proof is added.
const modules = import.meta.glob<{ default: Testimonial }>('../content/proof/*.json', {
  eager: true,
})

export const TESTIMONIALS: Testimonial[] = Object.values(modules).map((m) => m.default)

export const hasProof = TESTIMONIALS.length > 0
