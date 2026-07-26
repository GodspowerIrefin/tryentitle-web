import type { IconName } from '@/components/primitives/Icon'

/**
 * Operational pain points for the home page (PRD FR8).
 *
 * Each is stated as an OBSERVABLE SYMPTOM — something you would watch happen in
 * the office — not as a feature or a technology. Voice per PRD §8.1: plain,
 * concrete, operational. The set names at minimum manual intake, inbox handoffs,
 * duplicate data entry, slow approvals, and manual reporting.
 */
export interface PainPoint {
  id: string
  label: string
  symptom: string
  icon: IconName
}

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 'manual-intake',
    label: 'Manual intake',
    symptom:
      'Forms and requests arrive by email and get retyped into your system of record, one field at a time.',
    icon: 'inbox',
  },
  {
    id: 'inbox-handoffs',
    label: 'Inbox handoffs',
    symptom:
      'Work only moves forward when someone remembers to forward the thread to the next person.',
    icon: 'repeat',
  },
  {
    id: 'duplicate-data-entry',
    label: 'Duplicate data entry',
    symptom:
      'The same client details get keyed into three systems that don’t talk to each other.',
    icon: 'document',
  },
  {
    id: 'slow-approvals',
    label: 'Slow approvals',
    symptom:
      'Requests sit for days because no one can see what is waiting on them or whose turn it is.',
    icon: 'clock',
  },
  {
    id: 'manual-reporting',
    label: 'Manual reporting',
    symptom:
      'Someone rebuilds the same report every week, copying numbers between tabs by hand.',
    icon: 'activity',
  },
]
