import type { IconName } from '@/components/primitives/Icon'

/**
 * "The cost of manual work" — five leaks (design spec §4.4, PRD FR8).
 *
 * Each is stated as an OBSERVABLE SYMPTOM — something you would watch happen in
 * the office — not as a feature or a technology.
 *
 * STAT CHIP NOTE. The spec sketches two of these as figures ("~6 hrs/wk",
 * "4.2 DAY LAG"). They are written as structural observations instead. TryEntitle
 * has no measured client data, and the spec's own instruction is to publish only
 * your own observed ranges and "never cite a source you don't have" (§4.4). The
 * three chips that ARE kept verbatim — no queue, 3× entry, monthly rebuild —
 * describe the shape of the process rather than a measurement, so they are true
 * by inspection. Replace the qualitative two with real ranges once there is an
 * engagement to draw them from.
 */
export interface PainPoint {
  id: string
  label: string
  symptom: string
  icon: IconName
  /** Mono stat chip pinned to the card corner. */
  stat: string
}

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 'manual-intake',
    label: 'Manual intake',
    symptom:
      'Client information arrives by email, PDF, phone, and portal — then someone types it into your system by hand.',
    icon: 'inbox',
    stat: 'Retyped by hand',
  },
  {
    id: 'inbox-handoffs',
    label: 'Inbox handoffs',
    symptom:
      "Work lives in someone's inbox. If they're out, it stops. Nobody can see the queue.",
    icon: 'repeat',
    stat: 'No queue',
  },
  {
    id: 'duplicate-entry',
    label: 'Duplicate entry',
    symptom:
      'The same details get entered into three systems, and the third one is always slightly wrong.',
    icon: 'document',
    stat: '3× entry',
  },
  {
    id: 'slow-approvals',
    label: 'Slow approvals',
    symptom:
      'A file waits days for a signature that takes ninety seconds, because nobody knows it’s waiting.',
    icon: 'clock',
    stat: 'Days, not minutes',
  },
  {
    id: 'manual-reporting',
    label: 'Manual reporting',
    symptom:
      'Someone rebuilds the same spreadsheet every Monday because the data won’t come out clean.',
    icon: 'activity',
    stat: 'Monthly rebuild',
  },
]
