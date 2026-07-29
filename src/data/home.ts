/**
 * Home page copy (design spec §4). Kept out of components so a copy change never
 * touches a section (PRD §11.3 rule 4).
 *
 * Voice: plain, concrete, operational. Describes what happens to the WORK, not
 * what technology is used. No "leverage", "seamless", or "revolutionize".
 */
export const HOME_COPY = {
  hero: {
    eyebrow: 'Operations, rebuilt',
    title: 'Workflows that move business forward.',
    subhead:
      'Manual processes are slowing your team down and costing you money. We redesign your workflows and automate the repetitive parts, so your people can focus on the decisions that actually need them.',
  },

  systems: {
    label: 'We plug into what you already run',
  },

  painPoints: {
    eyebrow: 'Where the hours go',
    title: 'Six places the week quietly disappears.',
    intro: 'None of them look like a crisis. Together they cost you a full-time salary a year.',
  },

  positioning: {
    eyebrow: "What this isn't",
    title: 'Not software you have to learn. Not a fixed package you have to fit into.',
  },

  services: {
    eyebrow: 'Services',
    title: 'Six ways we take work off your team.',
    intro: 'Most engagements start with one. They rarely stay there.',
  },

  process: {
    eyebrow: 'The engagement',
    title: "You'll know what you're committing to before you commit to it.",
  },

  oversight: {
    eyebrow: 'How we differ',
    title: 'Full automation is a promise nobody keeps. We don’t make it.',
    body: 'Most of the work in a document-heavy process is repetitive and safe to automate. The rest is judgment — the unusual claim, the client who replies with something nobody anticipated, the number that looks wrong. We automate the repeatable part completely, and route the rest to a person with the full context attached. That is why our workflows are still running six months later.',
    automatedLabel: 'Automated',
    humanLabel: 'Human review',
  },

  industries: {
    eyebrow: 'Who this is for',
    title: 'If your business runs on documents and deadlines, this applies.',
    note: 'If your team handles documents, approvals, and deadlines by hand, the same approach applies.',
    noteCta: 'Tell us what your week looks like',
  },

  calculator: {
    eyebrow: 'Run the number',
    title: 'What is manual work costing you this year?',
    footnote:
      "An estimate from your own inputs, not a benchmark — we'll pressure-test it against your real process on the call.",
  },

  proof: {
    eyebrow: 'Why trust us yet',
    title: 'We’re new. Here’s what we’ll put in writing.',
  },

  fieldNotes: {
    eyebrow: 'Field notes',
    title: 'What we’re learning inside real operations.',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'The things people ask before booking.',
  },

  closing: {
    title: 'Thirty minutes. Bring your worst process.',
    body: 'No deck, no discovery gauntlet. You describe what your team does by hand, and we tell you what we’d automate first and roughly what it’d take. If it isn’t a fit, we’ll say that too.',
  },
} as const
