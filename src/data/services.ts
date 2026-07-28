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
  chips: readonly string[]
  /** Glyph from the shared icon set. */
  icon: IconName
}

export const SERVICES: ServiceSummary[] = [
  {
    slug: 'workflow-strategy-assessment',
    name: 'Workflow Strategy Assessment',
    headline: "Find out what's actually costing you",
    summary:
      'We map your real process — not the one in the handbook — and rank every step by hours, risk, and how automatable it is. You get the map whether or not you work with us.',
    chips: ['Process map', 'Hours by step', 'Automation ranking'],
    icon: 'map',
  },
  {
    slug: 'workflow-agents',
    name: 'Workflow Agents',
    headline: 'Software that does the steps, not just the reminders',
    summary:
      'Automated workers that read, decide, and act inside your existing tools, with rules you set and an approval gate wherever you want one.',
    chips: ['Rules you set', 'Approval gates', 'Runs in your tools'],
    icon: 'repeat',
  },
  {
    slug: 'document-operations',
    name: 'Document Operations',
    headline: 'Turn paperwork into structured data',
    summary:
      'Intake forms, contracts, claims, invoices, and reports — read, extracted, validated, and filed into your system in the right place, first time.',
    chips: ['Intake forms', 'Contracts', 'Claims', 'Invoices'],
    icon: 'document',
  },
  {
    slug: 'customer-operations',
    name: 'Customer Operations',
    headline: 'Nothing sits in an inbox again',
    summary:
      "Intake, scheduling, follow-ups, status updates, and handoffs, running on a visible queue instead of one person's memory.",
    chips: ['Intake', 'Scheduling', 'Follow-ups', 'Status updates'],
    icon: 'users',
  },
  {
    slug: 'internal-operations',
    name: 'Internal Operations',
    headline: 'Onboarding, approvals, and reporting that run themselves',
    summary:
      'The routing, the chasing, and the Monday spreadsheet — handled, with a dashboard that’s actually current.',
    chips: ['Approvals', 'Onboarding', 'Reconciliation', 'Reporting'],
    icon: 'inbox',
  },
  {
    slug: 'integrations-process-intelligence',
    name: 'Integrations & Process Intelligence',
    headline: 'Your systems, finally talking',
    summary:
      'We connect what you already pay for, then instrument it so you can see where work slows down before it becomes a problem.',
    chips: ['System connections', 'Bottleneck reporting', 'Cycle times'],
    icon: 'plug',
  },
]

export function getService(slug: string): ServiceSummary | undefined {
  return SERVICES.find((s) => s.slug === slug)
}
