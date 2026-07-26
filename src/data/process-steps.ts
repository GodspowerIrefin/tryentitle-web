/**
 * The engagement process for the home "what happens if I engage" section
 * (PRD FR11 / US3). Ordered steps, each naming what TryEntitle needs from the
 * client (`clientInput`) and what TryEntitle delivers (`output`), plus where a
 * human stays in the loop (`human`).
 *
 * This is the one place numbering is used on the home page — the process
 * genuinely is a sequence and order carries information (PRD §10.7).
 */
export interface ProcessStep {
  title: string
  /** What TryEntitle needs from the client at this step. */
  clientInput: string
  /** What TryEntitle delivers at this step. */
  output: string
  /** Where a human stays in the loop, if applicable at this step. */
  human?: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: 'Workflow review',
    clientInput: 'A walkthrough of how one process runs today, plus a few sample documents.',
    output: 'A map of how work actually moves, and a shortlist of what to automate, change, or leave alone.',
  },
  {
    title: 'Design',
    clientInput: 'Your constraints, deadlines, and the systems the work has to pass through.',
    output: 'A redesigned workflow with defined handoffs and the exact points where a human decides.',
    human: 'You sign off on the design and the rules for what counts as an exception.',
  },
  {
    title: 'Build',
    clientInput: 'Sandbox or credentialed access to the systems involved.',
    output: 'The automated steps, wired between your systems, with a review queue at each exception.',
    human: 'Your team reviews exceptions in the queue; the routine path runs on its own.',
  },
  {
    title: 'Run and refine',
    clientInput: 'The exceptions your team resolves and any changes in how you work.',
    output: 'Reporting on where work still slows down, and adjustments to the workflow over time.',
    human: 'Judgment calls stay with your team; the automation carries the repeatable parts.',
  },
]
