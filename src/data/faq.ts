/**
 * FAQ (design spec §4.13). Clears the last objections before the closing CTA,
 * and feeds the FAQPage JSON-LD (spec §6 SEO).
 *
 * Answers are written to be true for a company with no track record: they
 * describe how the engagement works, not results we cannot evidence.
 */
export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How long until something is actually running?',
    answer:
      'The assessment takes about a week. For most scopes the first workflow is live two to four weeks after that, because we build against one real process rather than a platform rollout.',
  },
  {
    question: 'Do we have to change the software we use?',
    answer:
      'No. We build around your current stack. If a tool is genuinely holding you back, we’ll say so — and say why.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Scoped per engagement after the assessment, because a three-person firm and a sixty-person operation aren’t the same job. You see a fixed number before anything is built.',
  },
  {
    question: 'What happens to the people doing this work now?',
    answer:
      'They stop re-typing and start handling the work that needs them — the exceptions, the judgment calls, and the client conversations that were getting squeezed out.',
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
