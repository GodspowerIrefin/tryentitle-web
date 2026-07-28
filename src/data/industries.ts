import type { IconName } from '../components/primitives/Icon/icons'

/**
 * The seven target industries (design spec §4.9, PRD §8.3 / FR10).
 *
 * Names and slugs are fixed. Each `blurb` names the workflow you would fix
 * first, in that field's own artifacts — generic industry copy actively damages
 * credibility with an ops lead who works in that field daily (PRD §17 risk).
 *
 * The list is explicitly NOT exhaustive; the section renders a note saying so.
 *
 * Cards carry an ICON, not a photograph: the spec's card anatomy is built on a
 * 40px icon tile (§2), and both the spec and PRD §10.8 rule out stock imagery.
 */
export interface IndustrySummary {
  slug: string
  name: string
  blurb: string
  icon: IconName
}

export const INDUSTRIES: IndustrySummary[] = [
  {
    slug: 'healthcare',
    name: 'Healthcare',
    blurb:
      'Patient intake, prior authorizations, and referral paperwork — captured once, routed correctly, HIPAA-conscious throughout.',
    icon: 'pulse',
  },
  {
    slug: 'legal',
    name: 'Legal',
    blurb:
      'Client intake, document review prep, matter setup, and billing capture — without a paralegal re-typing the same details four times.',
    icon: 'scale',
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    blurb:
      'Claims intake, document collection, and status updates handled automatically, with adjusters seeing only what needs a human call.',
    icon: 'shield',
  },
  {
    slug: 'accounting',
    name: 'Accounting',
    blurb:
      'Client document chasing, onboarding packets, and reconciliation prep — so busy season stops meaning night shifts.',
    icon: 'calculator',
  },
  {
    slug: 'real-estate-property-management',
    name: 'Real Estate & Property Management',
    blurb:
      'Applications, lease packets, maintenance requests, and owner reporting, routed and filed the moment they arrive.',
    icon: 'building',
  },
  {
    slug: 'construction',
    name: 'Construction',
    blurb:
      'Bids, submittals, change orders, and compliance documents tracked across every job without a single WhatsApp thread.',
    icon: 'hardhat',
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    blurb:
      'Proposals, onboarding, project intake, and recurring client reporting, running without a project manager babysitting them.',
    icon: 'briefcase',
  },
]
