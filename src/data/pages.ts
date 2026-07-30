/**
 * Copy for the overview pages and the shared closing CTA (PRD §8.1). Kept out of
 * components so wording changes never touch a section (PRD §11.3 rule 4).
 */
export const SERVICES_PAGE = {
  eyebrow: 'Services',
  title: 'Six ways we take work off your desk.',
  intro:
    'Each is scoped to your business — you do not buy a package, you get a redesigned process with automation inside it and a person on the exceptions.',
} as const

export const INDUSTRIES_PAGE = {
  eyebrow: 'Industries',
  title: 'Built around the documents your field runs on.',
  intro:
    'Pick a field to see the workflows we redesign — with a person on the exceptions.',
  note: 'If your work is document-heavy and repetitive, it likely applies.',
  noteCta: 'Tell us what your week looks like',
} as const

/**
 * Copy for the bands that fill out an industry detail page (PRD FR15).
 *
 * The headings are shared across all seven industries — the question reads the
 * same whichever field you are in. What changes per industry is the structured
 * content in data/industry-detail.ts.
 */
export const INDUSTRY_DETAIL_COPY = {
  useCases: {
    eyebrow: 'Use cases',
    title: 'Where are your best people doing the most manual work?',
    intro:
      'The workflows below are the ones we see holding up a week in this field. Each names what happens today, what we put in place instead, and what changes as a result.',
    problemLabel: 'Today',
    buildLabel: 'What we build',
    impactsLabel: 'What changes',
  },
  exception: {
    eyebrow: 'How it runs',
    title: 'Automated to the exception, then handed to a person.',
    systemsLabel: 'Systems this work moves between',
    humanLabel: 'Where a person stays in it',
    note: 'System categories, not integrations we are claiming — we work with whatever you already run.',
  },
  services: {
    eyebrow: 'Services',
    title: 'How the work gets delivered.',
    intro: 'The services that usually carry this work. Every engagement is scoped to your process.',
  },
} as const

/**
 * Copy for the "in practice" band on a service detail page (PRD FR14). The
 * service's Markdown body carries the narrative; this band carries the concrete
 * situations from data/service-detail.ts.
 */
export const SERVICE_DETAIL_COPY = {
  useCases: {
    eyebrow: 'In practice',
    title: 'What this looks like on a real workflow.',
    intro:
      'Not a feature list — the situations this service is usually brought in for, and what we build for each.',
    problemLabel: 'Today',
    buildLabel: 'What we build',
    impactsLabel: 'What changes',
  },
  industries: {
    eyebrow: 'Industries',
    title: 'Where this service does the most work.',
    intro:
      'It is not limited to these. If your work is document-heavy and repetitive, it likely applies.',
  },
} as const

/** The closing CTA copy reused across detail and overview pages. */
export const CLOSING = {
  title: 'Start with one workflow.',
  body: 'A workflow review is a focused look at one manual process — what it costs you now, and what it would take to redesign it. No obligation, no package to buy.',
} as const
