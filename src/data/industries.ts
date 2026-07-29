import type { IconName } from '../components/primitives/Icon/icons'

/**
 * The seven target industries (design spec §4.9, PRD §8.3 / FR10).
 *
 * Names and slugs are fixed. Each entry lists the concrete workflows we handle
 * in that field — generic industry copy actively damages credibility with an
 * ops lead who works there daily (PRD §17 risk).
 *
 * The list is explicitly NOT exhaustive; the section renders a note saying so.
 */
export interface IndustrySummary {
  slug: string
  name: string
  /** Concrete workflows shown when the industry dropdown opens. */
  workflows: readonly string[]
  icon: IconName
}

export const INDUSTRIES: IndustrySummary[] = [
  {
    slug: 'healthcare',
    name: 'Healthcare',
    workflows: [
      'Patient intake',
      'Insurance verification',
      'Prior authorization',
      'Referral processing',
      'Appointment routing',
    ],
    icon: 'pulse',
  },
  {
    slug: 'legal',
    name: 'Legal',
    workflows: [
      'Matter intake',
      'Conflict checks',
      'Client onboarding',
      'Document review',
      'Billing entry sync',
    ],
    icon: 'scale',
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    workflows: [
      'Claims intake',
      'Policy validation',
      'Adjuster assignment',
      'Renewal processing',
    ],
    icon: 'shield',
  },
  {
    slug: 'accounting',
    name: 'Accounting',
    workflows: [
      'Client document collection',
      'Data entry from statements',
      'Approval routing',
      'Recurring report generation',
    ],
    icon: 'calculator',
  },
  {
    slug: 'real-estate-property-management',
    name: 'Real Estate',
    workflows: [
      'Transaction document handling',
      'Client onboarding',
      'Closing coordination',
    ],
    icon: 'building',
  },
  {
    slug: 'construction',
    name: 'Construction',
    workflows: [
      'Permit tracking',
      'Subcontractor document collection',
      'Invoice processing',
      'Change order routing',
    ],
    icon: 'hardhat',
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    workflows: [
      'Client intake',
      'Proposal and contract routing',
      'Recurring reporting',
      'Billing sync',
    ],
    icon: 'briefcase',
  },
]
