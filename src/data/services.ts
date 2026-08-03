/**
 * The six core services (design spec §4.6, PRD §8.2).
 *
 * THE SIX NAMES ARE FIXED. They must match across nav, home, services, footer,
 * and metadata. `name` and `slug` do not change without a PRD update.
 *
 * Each entry carries three things the sticky tab rail needs: a `headline` (the
 * outcome, in the customer's terms), a `summary` (the one-line promise), and
 * `chips` (concrete examples, so the abstract service name lands on something
 * the reader recognises from their own week).
 */
import type { IconName } from '../components/primitives/Icon/icons'

export interface ServiceSummary {
  slug: string
  name: string
  /** Outcome headline shown in the rail panel. */
  headline: string
  /** One-line promise — plain, operational, no jargon (PRD §8.1). */
  summary: string
  /** Concrete examples rendered as record chips. */
  /** Glyph from the shared icon set. */
  icon: IconName
}

export const SERVICES: ServiceSummary[] = [
  {
    slug: 'workflow-strategy-assessment',
    name: 'Workflow Strategy Assessment',
    headline: 'See where the time actually goes',
    summary:
      'We follow one of your processes end to end and show you which steps to automate, which to fix, and which to leave alone.',
    icon: 'map',
  },
  {
    slug: 'workflow-agents',
    name: 'Workflow Agents',
    headline: 'The repetitive steps, handled',
    summary: 'Automation that does the routine work and hands anything unusual to a person.',
    icon: 'repeat',
  },
  {
    slug: 'document-operations',
    name: 'Document Operations',
    headline: 'Documents in, data out',
    summary:
      'Forms, PDFs, and emails become clean entries in your system without anyone retyping them.',
    icon: 'document',
  },
  {
    slug: 'customer-operations',
    name: 'Customer Operations',
    headline: 'Onboarding without the chase',
    summary:
      'Intake, updates, and scheduling happen on their own, so nothing sits waiting on a follow-up.',
    icon: 'users',
  },
  {
    slug: 'internal-operations',
    name: 'Internal Operations',
    headline: "Approvals that don't sit",
    summary:
      'Requests reach the right person, and the reports you rebuild every week build themselves.',
    icon: 'inbox',
  },
  {
    slug: 'integrations-process-intelligence',
    name: 'Integrations & Process Intelligence',
    headline: 'Your systems, finally talking',
    summary:
      'Data moves between the tools you already pay for, and you can see where work slows down.',
    icon: 'plug',
  },
]

export function getService(slug: string): ServiceSummary | undefined {
  return SERVICES.find((s) => s.slug === slug)
}
