/**
 * "How an engagement runs" (design spec §4.7, PRD FR11 / US3).
 *
 * Ordered steps with a timing marker each. Numbering is legitimate here because
 * it is a real sequence and order carries information — it is used here and only
 * here on the home page.
 *
 * Step 02 carries the risk reversal that the whole page leans on: walk away and
 * you keep the map. That is the single most persuasive line available to a
 * company with no track record, so it stays in the step copy rather than being
 * buried in the commitments section alone.
 */
export interface ProcessStep {
  title: string
  /** What happens at this step, in plain language. */
  detail: string
  /** Timing marker — Day 0, Week 1, Weeks 2–4, Ongoing. */
  timing: string
  /** What the client walks away holding after this step. */
  output: string
  /**
   * A pull-out guarantee. Only one step carries one, deliberately: it is the
   * strongest risk-reversal available to a company with no track record, and
   * burying it mid-paragraph wasted it.
   */
  note?: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: 'Workflow review',
    detail:
      'A 30-minute call. We ask what your team does by hand and where things stall. No slides.',
    timing: 'Day 0',
    output: 'A shortlist of what to fix first',
  },
  {
    title: 'Process map & scope',
    detail:
      'We document the real workflow, show you where the hours are, and price a fixed scope.',
    timing: 'Week 1',
    output: 'A process map and a fixed price',
    note: 'Walk away here and you keep the map.',
  },
  {
    title: 'Build & pilot',
    detail:
      'We build it, run it alongside your current process, and tune it against real cases — not test data.',
    timing: 'Weeks 2–4',
    output: 'A working workflow, proven on real cases',
  },
  {
    title: 'Run & watch',
    detail: 'It goes live. We stay on the exceptions and report on what it’s saving you.',
    timing: 'Ongoing',
    output: 'Reporting, and a person on the exceptions',
  },
]
