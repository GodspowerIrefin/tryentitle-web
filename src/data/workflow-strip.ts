/**
 * The Live Workflow Strip — the site's signature element (design spec §1).
 *
 * A single document travelling through six stages, in two states. The gold
 * `human` node in the after-state is the entire positioning in one visual:
 * automated end to end, with a person exactly where judgment is needed.
 *
 * COPY NOTE — friction stamps.
 * The spec sketches these as hard figures ("3.5 days"). They are written here as
 * qualitative observations instead, because TryEntitle has no measured client
 * data yet and the spec's own guidance is "never cite a source you don't have"
 * (§4). A number on a diagram reads as a finding to the exact mid-market ops
 * lead this page is written for. Swap these for real ranges the moment there is
 * an engagement to draw them from.
 */

export interface WorkflowStage {
  /** Short stage label shown under the node. */
  label: string
  /** Friction annotation — before-state only. */
  stamp?: string
  /** Marks the single human-judgment node in the after-state. */
  human?: boolean
}

export const BEFORE_STAGES: WorkflowStage[] = [
  { label: 'Email inbox', stamp: 'sits unread' },
  { label: 'Printed' },
  { label: 'Re-keyed', stamp: 'entered twice' },
  { label: 'Chased' },
  { label: 'Approved', stamp: 'waiting on approval' },
  { label: 'Filed' },
]

export const AFTER_STAGES: WorkflowStage[] = [
  { label: 'Intake' },
  { label: 'Extract' },
  { label: 'Validate' },
  { label: 'Human check', human: true },
  { label: 'Route' },
  { label: 'Delivered' },
]
