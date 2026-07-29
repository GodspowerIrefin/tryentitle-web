/**
 * FAQ (design spec §4.13). Clears the last objections before the closing CTA,
 * and feeds the FAQPage JSON-LD (spec §6 SEO).
 *
 * Answers are written to be true for a company with no track record: they
 * describe how the engagement works, not results we cannot evidence.
 *
 * `HOME_FAQ` is the short set on the home page. `FAQ_ITEMS` is the full list on
 * `/faq` — home links through so visitors who want more detail have somewhere
 * to go without bloating the conversion path.
 */
export interface FaqItem {
  question: string
  answer: string
}

/** Three objections cleared on the home page before the closing CTA. */
export const HOME_FAQ: FaqItem[] = [
  {
    question: 'Do we need to buy new software?',
    answer: 'No. We build on the systems you already use.',
  },
  {
    question: 'Will this replace my staff?',
    answer:
      'No. It removes repetitive work so your team can focus on higher-value decisions.',
  },
  {
    question: "What if we don't move forward after the review?",
    answer: 'You keep the process map. No obligation either way.',
  },
]

/** Full FAQ — home short set plus the longer engagement questions. */
export const FAQ_ITEMS: FaqItem[] = [
  ...HOME_FAQ,
  {
    question: 'How long until something is actually running?',
    answer:
      'The assessment takes about a week. For most scopes the first workflow is live two to four weeks after that, because we build against one real process rather than a platform rollout.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Scoped per engagement after the assessment, because a three-person firm and a sixty-person operation aren’t the same job. You see a fixed number before anything is built.',
  },
  {
    question: 'Is our client data safe?',
    answer:
      'We work inside your systems under your permissions, sign a DPA, and don’t move data anywhere it doesn’t already live. Details are on the Security page.',
  },
  {
    question: 'What if our process is a mess?',
    answer:
      'That’s the normal starting condition. The mapping step exists precisely because nobody’s process is documented accurately.',
  },
]
