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
  /**
   * What changes for a firm in this field, in their own terms — the marquee
   * tiles lead with this rather than a workflow list, because the outcome is
   * what an ops lead recognises at a glance.
   */
  outcome: string
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
    outcome:
      'Stop losing appointments to voicemail, cut turnaround from days to hours, and catch registration errors before they come back as denials.',
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
    outcome:
      'Handle matter intake, conflict checks, engagement letters, and discovery paperwork so your attorneys spend their time on the matter, not the paper trail.',
    icon: 'scale',
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    workflows: ['Claims intake', 'Policy validation', 'Adjuster assignment', 'Renewal processing'],
    outcome:
      'Move quotes, applications, and policy documents through your team faster, with fewer re-keyed fields and fewer files stuck waiting on a missing page.',
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
    outcome:
      'Stop chasing clients for documents. Collect them, check them, and keep recurring engagements moving without the manual follow-up.',
    icon: 'calculator',
  },
  {
    slug: 'real-estate-property-management',
    name: 'Real Estate',
    workflows: ['Transaction document handling', 'Client onboarding', 'Closing coordination'],
    outcome:
      'Pull closing binders, leases, and maintenance requests into one workflow, and answer every lead the hour it arrives.',
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
    outcome:
      'Keep submittals, change orders, approvals, and project documents organized from bid to closeout, without the inbox hunt.',
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
    outcome:
      'Automate client intake, proposal and contract routing, recurring reporting, and billing sync so your team bills more and chases less.',
    icon: 'briefcase',
  },
]
