/**
 * Proof without logos (design spec §4.11).
 *
 * TryEntitle has no track record yet, and inventing one is the fastest way to
 * lose a mid-market ops lead. So social proof is replaced with PROCESS proof:
 * what the buyer owns, what the scope is, what happens to their data, and what
 * we will put in writing.
 *
 * ⚠ COMMERCIAL AND COMPLIANCE CLAIMS — REQUIRES OWNER SIGN-OFF BEFORE LAUNCH.
 * Every string below is a promise the business has to honour. The refund
 * commitment is a contractual term, and the compliance markers are regulatory
 * claims. The design spec's own rule is "only claim what is true today; label
 * anything in progress as such" (§4.11), and PRD FR21 blocks launch on unreviewed
 * legal text. `COMPLIANCE_MARKERS` is deliberately easy to empty — an empty
 * array renders nothing rather than a half-true row.
 */
import type { IconName } from '../components/primitives/Icon/icons'

export interface ProofCommitment {
  title: string
  body: string
  /** Short mono label for the row's dark mark panel. */
  label: string
  /** Glyph at the centre of the mark. */
  icon: IconName
}

export const PROOF_COMMITMENTS: ProofCommitment[] = [
  {
    title: 'You keep the map.',
    body: 'After the assessment, the process documentation is yours — whether or not we go further.',
    label: 'Ownership',
    icon: 'map',
  },
  {
    title: 'Fixed scope, fixed price.',
    body: 'You approve a written scope before anything is built. No hourly drift.',
    label: 'Scope',
    icon: 'document',
  },
  {
    title: 'Your data stays yours.',
    body: 'We work inside your systems, under your access controls, with a signed DPA. Nothing is used to train anything.',
    label: 'Data',
    icon: 'shield',
  },
  {
    title: 'If it doesn’t run, you don’t pay for it.',
    body: 'If a workflow doesn’t hit the agreed outcome in the pilot, we rebuild it or refund the build fee.',
    label: 'Guarantee',
    icon: 'check',
  },
]

/**
 * Compliance markers shown beneath the commitments, linking to /security.
 * Ship ONLY what is true today. Anything aspirational must say so in the label
 * itself (e.g. "SOC 2 — in progress"), never by implication.
 */
