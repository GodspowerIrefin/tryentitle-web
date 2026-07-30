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
    headline: 'A full map before anything is built',
    summary:
      'A full map of your current process, showing exactly where the bottlenecks are, before anything is built.',
    icon: 'map',
  },
  {
    slug: 'workflow-agents',
    name: 'Workflow Agents',
    headline: 'Repetitive work handled; judgment stays human',
    summary:
      'Agents handle the repetitive parts of your workflow — reading, deciding, routing — so people only step in where real judgment is needed.',
    icon: 'repeat',
  },
  {
    slug: 'document-operations',
    name: 'Document Operations',
    headline: 'Read, sorted, and entered — automatically',
    summary:
      'Documents are read, sorted, and entered into your system automatically and accurately, every time.',
    icon: 'document',
  },
  {
    slug: 'customer-operations',
    name: 'Customer Operations',
    headline: 'Onboarding without the chase',
    summary:
      'Onboarding runs from first submission to a fully ready file, without manual follow-up.',
    icon: 'users',
  },
  {
    slug: 'internal-operations',
    name: 'Internal Operations',
    headline: 'Routing, approvals, and live reports',
    summary:
      'Requests route automatically with a full approval trail, and reports stay current — pulled directly from your systems.',
    icon: 'inbox',
  },
  {
    slug: 'integrations-process-intelligence',
    name: 'Integrations & Process Intelligence',
    headline: 'Systems in sync, work in view',
    summary:
      'Your systems sync automatically, and you get real visibility into how work is moving.',
    icon: 'plug',
  },
]

export function getService(slug: string): ServiceSummary | undefined {
  return SERVICES.find((s) => s.slug === slug)
}
