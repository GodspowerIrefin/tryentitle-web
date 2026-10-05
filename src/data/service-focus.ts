/**
 * The "Service · in focus" carousel on /services.
 *
 * COPY IS VERBATIM from the client's correction document (correction.docx) —
 * description, symptoms, deliverables, the control note, and each slide's CTA
 * label. Do not reword any of it without a new correction; the headings
 * ("The symptoms", "What you receive", "Your team stays in control") are the
 * document's own and are rendered as written.
 *
 * Slide order follows the document's hub-page Solutions list, which is also the
 * order of SERVICES — the numbered list above the carousel and the slides stay
 * in step.
 */
export interface ServiceFocus {
  /** Matches a slug in SERVICES, so the slide links to its detail page. */
  slug: string
  name: string
  description: string
  symptoms: readonly string[]
  receive: readonly string[]
  control: string
  /** The document gives each service its own CTA label. */
  cta: string
}

export const SERVICE_FOCUS: readonly ServiceFocus[] = [
  {
    slug: 'operations-assessment',
    name: 'Operations Assessment',
    description:
      'A one-time review of how a critical process operates across your people, systems, and handoffs, done before anything changes, to identify where time, capacity, and operational efficiency are being lost.',
    symptoms: [
      'Work gets stuck without a clear reason.',
      'Teams rely on manual coordination.',
      'The same work is handled differently across the organization.',
      'Leadership knows something is inefficient but cannot identify where.',
    ],
    receive: [
      'A clear view of the current operation.',
      'Identification of the most significant sources of friction.',
      'Prioritized opportunities for improvement.',
      'A recommended path forward.',
    ],
    control:
      'We work with the people closest to the operation to validate what we find. You decide what changes and when.',
    cta: 'Book an Assessment',
  },
  {
    slug: 'process-design-optimization',
    name: 'Process Design & Optimization',
    description:
      'We improve how work moves through your organization by reducing unnecessary effort, simplifying workflows, and applying automation where it creates meaningful operational value.',
    symptoms: [
      'Routine work consumes valuable employee capacity.',
      'Teams spend too much time coordinating, checking, or following up.',
      'Work moves through unnecessary steps or approvals.',
      'Processes vary depending on who performs them.',
    ],
    receive: [
      'A more efficient operating workflow.',
      'Clearer ownership and responsibilities.',
      'Reduced manual effort across routine work.',
      'Automation applied where it supports the way your business needs to operate.',
    ],
    control:
      'Your team remains involved in decisions that affect how work is performed. We recommend and implement improvements within the agreed scope, while you retain control over business rules and operational decisions.',
    cta: 'Improve a Process',
  },
  {
    slug: 'systems-integration',
    name: 'Systems Integration',
    description:
      'We connect the systems your business already relies on so information can move where it needs to go without unnecessary manual intervention.',
    symptoms: [
      'Employees repeatedly enter the same information into multiple systems.',
      'Your systems contain conflicting or incomplete information.',
      'Teams rely on spreadsheets or manual workarounds to move information.',
      'Important information does not reach the people or systems that need it.',
    ],
    receive: [
      'Connected systems that support the way your business operates.',
      'More reliable movement of information between applications.',
      'Clearer ownership of important business data.',
      'Greater visibility when something requires attention.',
    ],
    control:
      'Your team determines how important information should be handled across the business. We build within those requirements and preserve visibility when information requires review.',
    cta: 'Connect Your Systems',
  },
  {
    slug: 'operational-intelligence',
    name: 'Operational Intelligence',
    description:
      'We bring operational information together and show how your processes perform over time, so leadership can see where work slows down, why the same problems keep returning, and what deserves attention.',
    symptoms: [
      'Reporting takes too much manual effort.',
      'Leadership lacks a consistent view of operational performance.',
      'Bottlenecks are discussed but not clearly measured.',
      'Information is spread across multiple systems.',
      'The same operational problems continue to return.',
      'Exceptions are frequent but difficult to analyze.',
      'Improvements are made without a clear way to measure their impact.',
    ],
    receive: [
      'A clearer view of operational performance.',
      'Reporting built around the measures that matter to your business.',
      'Greater visibility into bottlenecks and areas of concern.',
      'Identification of recurring patterns and areas of friction.',
      'A foundation for measuring operational improvement.',
    ],
    control:
      'The information supports your decisions rather than replacing them. We surface the patterns that matter; your team provides the business context, interprets results, sets priorities, and decides what action to take.',
    cta: 'Improve Operational Visibility',
  },
  {
    slug: 'managed-operations',
    name: 'Managed Operations',
    description:
      'We provide ongoing oversight for the operational systems and workflows we help put in place, keeping them aligned as your business changes.',
    symptoms: [
      'Automation requires ongoing attention that your team does not have time to provide.',
      'Processes and business requirements change over time.',
      'Issues are discovered only after they affect operations.',
      'No one owns the ongoing improvement of the systems supporting the workflow.',
    ],
    receive: [
      'Ongoing oversight of the agreed operational environment.',
      'Identification and resolution of issues within scope.',
      "Adjustments to what we've already built as workflows and business requirements evolve.",
      'Continued visibility into performance and opportunities for improvement.',
    ],
    control:
      'You remain informed about meaningful changes and decisions affecting your operation. We manage the agreed scope while your team retains authority over business requirements and priorities.',
    cta: 'Keep Your Operations Running',
  },
]
