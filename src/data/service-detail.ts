/**
 * Structured detail content for each service page (PRD FR14 / §8.2).
 *
 * The Markdown body of a service carries the narrative, the symptoms it
 * addresses, what we deliver, and where a human stays in the loop.
 *
 * This file used to carry an "In practice" layer as well — named situations with
 * what we build for each, rendered as a card grid under the body. That section
 * was removed from the service pages, so only the industry cross-links remain.
 *
 * `industries` lists the fields where this service does the most work: the
 * cross-links that keep a reader moving between the two page types (FR3).
 */

export interface ServiceDetail {
  slug: string
  /** Slugs of the industries this service most often runs in. */
  industries: string[]
}

export const SERVICE_DETAIL: ServiceDetail[] = [
  {
    slug: 'operations-assessment',
    industries: ['healthcare', 'accounting', 'professional-services'],
  },
  {
    slug: 'process-design-optimization',
    industries: ['insurance', 'construction', 'healthcare'],
  },
  {
    slug: 'systems-integration',
    industries: ['healthcare', 'legal', 'accounting'],
  },
  {
    slug: 'managed-operations',
    industries: ['real-estate-property-management', 'professional-services', 'insurance'],
  },
  {
    slug: 'operational-intelligence',
    industries: ['accounting', 'legal', 'construction'],
  },
]

const bySlug = new Map(SERVICE_DETAIL.map((d) => [d.slug, d]))

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return bySlug.get(slug)
}
