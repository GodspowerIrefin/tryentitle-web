/**
 * Content-layer types and frontmatter schemas (PRD §11.5).
 *
 * Every MDX/Markdown document has Zod-validated frontmatter. A missing
 * description or a malformed date is a BUILD failure (raised by the md-content
 * Vite plugin), not a production bug. These schemas are the single definition of
 * what each collection's frontmatter must contain.
 */
import { z } from 'zod'

/** ISO date, e.g. "2026-07-23". Rejects anything Date can't parse. */
const isoDate = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: 'must be a valid date (YYYY-MM-DD)' })

export const serviceFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** Optional explicit ordering; falls back to the canonical services order. */
  order: z.number().optional(),
})

export const industryFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})

export const blogFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  draft: z.boolean().optional().default(false),
})

export const legalFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** "Last updated" date shown on every legal page (PRD FR20). */
  updatedAt: isoDate,
  /**
   * Whether counsel (or a licensed template) has reviewed this document — the
   * FR21 launch gate. Defaults to false: an unreviewed document renders a
   * prominent draft warning and is marked noindex, so unreviewed legal text can
   * never quietly ship as if it were final. Flip to true only after review.
   */
  reviewed: z.boolean().optional().default(false),
})

/**
 * Proof/testimonial schema (PRD FR12 / §8.4).
 *
 * Requires a named person, role, and company plus explicit written permission.
 * `permission` must be literally `true`, so an anonymous or unpermitted
 * testimonial fails the build — the component is deliberately awkward to add
 * fake proof to. Validated at build time by the `proofGuard` Vite plugin, which
 * keeps this schema (and zod) out of the client bundle.
 */
export const testimonialSchema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  permission: z.literal(true),
})

export type Testimonial = z.infer<typeof testimonialSchema>

export type ServiceFrontmatter = z.infer<typeof serviceFrontmatterSchema>
export type IndustryFrontmatter = z.infer<typeof industryFrontmatterSchema>
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>
export type LegalFrontmatter = z.infer<typeof legalFrontmatterSchema>

/** One heading extracted from the rendered document, for tables of contents. */
export interface TocEntry {
  depth: number
  text: string
  id: string
}

/** The shape the md-content plugin emits as each document's default export. */
export interface MarkdownDoc<F> {
  slug: string
  frontmatter: F
  /** Rendered, sanitised HTML. */
  html: string
  /** Extracted h2/h3 headings for a table of contents. */
  toc: TocEntry[]
  /** Reading time in minutes (ceil), computed at build time. */
  readingMinutes: number
  /** First paragraph, plain text, for list excerpts. */
  excerpt: string
}
