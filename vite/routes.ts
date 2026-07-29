import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { SERVICES } from '../src/data/services'
import { INDUSTRIES } from '../src/data/industries'

/**
 * Build-time route enumeration (Node). Shared by SSG route expansion and the
 * sitemap generator so both always agree on which pages exist. Draft blog posts
 * are excluded (PRD §11.5); `/404` is never indexable (PRD FR6).
 */

function contentDir(collection: string): string {
  return fileURLToPath(new URL(`../src/content/${collection}/`, import.meta.url))
}

function mdFiles(collection: string): string[] {
  const dir = contentDir(collection)
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.endsWith('.md'))
}

/** Blog slugs, excluding drafts (frontmatter `draft: true`). */
export function blogSlugs(): string[] {
  return mdFiles('blog')
    .map((file) => {
      const raw = readFileSync(contentDir('blog') + file, 'utf-8')
      const { data } = matter(raw)
      return { slug: file.replace(/\.md$/, ''), draft: Boolean(data.draft) }
    })
    .filter((p) => !p.draft)
    .map((p) => p.slug)
}

export function legalSlugs(): string[] {
  return mdFiles('legal').map((f) => f.replace(/\.md$/, ''))
}

/**
 * Legal documents cleared for indexing. Unreviewed drafts stay out of the
 * sitemap (and are marked noindex by the page itself) — the FR21 launch gate.
 */
export function reviewedLegalSlugs(): string[] {
  return mdFiles('legal')
    .map((file) => {
      const raw = readFileSync(contentDir('legal') + file, 'utf-8')
      const { data } = matter(raw)
      return { slug: file.replace(/\.md$/, ''), reviewed: data.reviewed === true }
    })
    .filter((d) => d.reviewed)
    .map((d) => d.slug)
}

/** Concrete detail-page paths for dynamic routes (services/industries/blog). */
export function detailPaths(): string[] {
  return [
    ...SERVICES.map((s) => `/services/${s.slug}`),
    ...INDUSTRIES.map((i) => `/industries/${i.slug}`),
    ...blogSlugs().map((slug) => `/blog/${slug}`),
  ]
}

/** Every indexable route, for the sitemap (legal included, /404 excluded). */
export function indexableRoutes(): string[] {
  return Array.from(
    new Set([
      '/',
      '/services',
      '/industries',
      '/blog',
      '/faq',
      ...detailPaths(),
      ...reviewedLegalSlugs().map((slug) => `/${slug}`),
    ]),
  )
}
