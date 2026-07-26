/**
 * Content layer access (PRD §11.5).
 *
 * Reads the collections compiled by the md-content plugin. Only type-only
 * imports touch the schema module, so no validation/parser code ships to the
 * client — these are plain data lookups over build-time-rendered documents.
 *
 * `draft: true` posts are excluded from production builds and the sitemap.
 */
import type {
  MarkdownDoc,
  ServiceFrontmatter,
  IndustryFrontmatter,
  BlogFrontmatter,
  LegalFrontmatter,
} from '@/types/content'
import { SERVICES } from '@/data/services'
import { INDUSTRIES } from '@/data/industries'

type Glob<F> = Record<string, { default: MarkdownDoc<F> }>

function toArray<F>(modules: Glob<F>): MarkdownDoc<F>[] {
  return Object.values(modules).map((m) => m.default)
}

// Relative globs (import.meta.glob does not expand the `@` alias).
const serviceDocs = toArray<ServiceFrontmatter>(
  import.meta.glob('../content/services/*.md', { eager: true }) as Glob<ServiceFrontmatter>,
)
const industryDocs = toArray<IndustryFrontmatter>(
  import.meta.glob('../content/industries/*.md', { eager: true }) as Glob<IndustryFrontmatter>,
)
const blogDocs = toArray<BlogFrontmatter>(
  import.meta.glob('../content/blog/*.md', { eager: true }) as Glob<BlogFrontmatter>,
)
const legalDocs = toArray<LegalFrontmatter>(
  import.meta.glob('../content/legal/*.md', { eager: true }) as Glob<LegalFrontmatter>,
)

/* ── Services ─────────────────────────────────────────────────────────── */

const serviceOrder = new Map(SERVICES.map((s, i) => [s.slug, i]))

export const serviceContent = [...serviceDocs].sort(
  (a, b) => (serviceOrder.get(a.slug) ?? 99) - (serviceOrder.get(b.slug) ?? 99),
)

export function getServiceContent(slug: string): MarkdownDoc<ServiceFrontmatter> | undefined {
  return serviceContent.find((d) => d.slug === slug)
}

/* ── Industries ───────────────────────────────────────────────────────── */

const industryOrder = new Map(INDUSTRIES.map((i, idx) => [i.slug, idx]))

export const industryContent = [...industryDocs].sort(
  (a, b) => (industryOrder.get(a.slug) ?? 99) - (industryOrder.get(b.slug) ?? 99),
)

export function getIndustryContent(slug: string): MarkdownDoc<IndustryFrontmatter> | undefined {
  return industryContent.find((d) => d.slug === slug)
}

/* ── Blog ─────────────────────────────────────────────────────────────── */

/** Published posts, newest first. Drafts are excluded from production builds. */
export const blogPosts = [...blogDocs]
  .filter((p) => import.meta.env.DEV || !p.frontmatter.draft)
  .sort((a, b) => Date.parse(b.frontmatter.publishedAt) - Date.parse(a.frontmatter.publishedAt))

export function getBlogPost(slug: string): MarkdownDoc<BlogFrontmatter> | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

/* ── Legal ────────────────────────────────────────────────────────────── */

export function getLegalContent(slug: string): MarkdownDoc<LegalFrontmatter> | undefined {
  return legalDocs.find((d) => d.slug === slug)
}
