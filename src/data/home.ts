/**
 * Home page copy (PRD §8.1 voice). Kept out of components so a copy change never
 * touches a section (PRD §11.3 rule 4). Final wording is a content task; this is
 * the PRD's plain-operational starting draft.
 */
export const HOME_COPY = {
  hero: {
    eyebrow: 'Workflow automation',
    title: 'We redesign the work, then automate the repeatable parts.',
    subhead:
      'TryEntitle finds the manual, document-heavy work inside your business, rebuilds the workflow around it, and keeps a person on the judgment calls and exceptions.',
    meta: ['Agents', 'Integrations', 'Human review'],
    image: {
      src: '/images/hero-tech.jpg',
      alt: 'Laptop showing code on a desk beside a cup of coffee',
    },
  },
  painPoints: {
    eyebrow: 'What we look for',
    title: 'The work that quietly eats the week.',
    intro: 'Not features — the things you can watch happen in the office every day.',
    image: {
      src: '/images/pain-systems.jpg',
      alt: 'Rows of servers in a data center aisle',
    },
  },
  services: {
    eyebrow: 'What we do',
    title: 'Six ways we take work off your desk.',
    intro: 'Scoped per client. You do not buy a package; you get a redesigned process.',
  },
  industries: {
    eyebrow: 'Who it’s for',
    title: 'Built around the documents your field actually runs on.',
    intro: 'A starting set. If your work is document-heavy and repetitive, it likely applies.',
    note: 'This list is not exhaustive.',
  },
  process: {
    eyebrow: 'What happens if we work together',
    title: 'A short sequence, with you on the exceptions.',
    intro: 'What we need from you, and what you get back, at each step.',
    image: {
      src: '/images/process-code.jpg',
      alt: 'Close-up of code on a monitor',
    },
  },
  closing: {
    title: 'Start with one workflow.',
    body: 'A workflow review is a focused look at one manual process — what it costs you now, and what it would take to redesign it. No obligation, no package to buy.',
    image: {
      src: '/images/closing-infra.jpg',
      alt: '',
    },
  },
} as const
