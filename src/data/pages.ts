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
    'We start from the real artifacts of your work — the forms, packets, and filings you handle every day — not a generic template.',
  note: 'This list is not exhaustive. If your work is document-heavy and repetitive, it likely applies.',
} as const

/** The closing CTA copy reused across detail and overview pages. */
export const CLOSING = {
  title: 'Start with one workflow.',
  body: 'A workflow review is a focused look at one manual process — what it costs you now, and what it would take to redesign it. No obligation, no package to buy.',
} as const
