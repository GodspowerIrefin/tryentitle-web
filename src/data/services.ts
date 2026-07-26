/**
 * The six core services — canonical names and one-line definitions (PRD §8.2).
 *
 * THE SIX NAMES ARE FIXED. They must match across nav, home, services, footer,
 * and metadata. Copy below is the PRD's starting draft; final wording is a
 * content task, but `name` and `slug` do not change without a PRD update.
 */
import type { IconName } from '../components/primitives/Icon/icons'

export interface ServiceSummary {
  slug: string
  name: string
  /** One-line definition — plain, operational, no jargon (PRD §8.1). */
  summary: string
  /** Glyph from the shared icon set. */
  icon: IconName
}

export const SERVICES: ServiceSummary[] = [
  {
    slug: 'workflow-strategy-assessment',
    name: 'Workflow Strategy Assessment',
    summary:
      'We map how work actually moves through your business and identify what should be automated, changed, or left alone.',
    icon: 'activity',
  },
  {
    slug: 'workflow-agents',
    name: 'Workflow Agents',
    summary:
      'Automated steps that carry work between systems and people, with defined handoffs when judgment is required.',
    icon: 'repeat',
  },
  {
    slug: 'document-operations',
    name: 'Document Operations',
    summary:
      'Intake, extraction, validation, and filing for the documents your business runs on.',
    icon: 'document',
  },
  {
    slug: 'customer-operations',
    name: 'Customer Operations',
    summary:
      'The work that happens around a customer — requests, follow-ups, status, scheduling.',
    icon: 'users',
  },
  {
    slug: 'internal-operations',
    name: 'Internal Operations',
    summary:
      'Approvals, reporting, reconciliation, and the handoffs between your own teams.',
    icon: 'inbox',
  },
  {
    slug: 'integrations-process-intelligence',
    name: 'Integrations & Process Intelligence',
    summary:
      'Connecting the systems you already pay for, and reporting on where work slows down.',
    icon: 'plug',
  },
]

export function getService(slug: string): ServiceSummary | undefined {
  return SERVICES.find((s) => s.slug === slug)
}
