/**
 * The seven target industries (PRD §8.3).
 *
 * Names and slugs are fixed. The `blurb` is a short overview-card line; each
 * industry's detail page must name real artifacts from that field (PRD §8.3,
 * Risk in §17) — that content lives in the MDX content layer, not here.
 *
 * The list is explicitly NOT exhaustive (PRD FR10); the overview and home
 * sections state so.
 */
export interface IndustrySummary {
  slug: string
  name: string
  blurb: string
  /** Editorial photo used on overview cards. */
  image: string
}

export const INDUSTRIES: IndustrySummary[] = [
  {
    slug: 'healthcare',
    name: 'Healthcare',
    blurb: 'Prior-authorization packets, referrals, and intake that arrive by fax and email.',
    image: '/images/industry-healthcare.jpg',
  },
  {
    slug: 'legal',
    name: 'Legal',
    blurb: 'Engagement letters, discovery, and matter intake retyped between systems.',
    image: '/images/industry-legal.jpg',
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    blurb: 'ACORD forms, submissions, and claims documents that move by attachment.',
    image: '/images/industry-insurance.jpg',
  },
  {
    slug: 'accounting',
    name: 'Accounting',
    blurb: 'Client documents, reconciliations, and filing deadlines tracked by hand.',
    image: '/images/industry-accounting.jpg',
  },
  {
    slug: 'real-estate-property-management',
    name: 'Real Estate & Property Management',
    blurb: 'Closing binders, leases, and maintenance requests spread across inboxes.',
    image: '/images/industry-real-estate.jpg',
  },
  {
    slug: 'construction',
    name: 'Construction',
    blurb: 'Lien waivers, submittals, and pay applications chased across subcontractors.',
    image: '/images/industry-construction.jpg',
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    blurb: 'Proposals, onboarding, and status reporting that live in email threads.',
    image: '/images/industry-professional.jpg',
  },
]

export function getIndustry(slug: string): IndustrySummary | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}
