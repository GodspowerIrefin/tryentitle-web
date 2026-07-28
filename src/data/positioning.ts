/**
 * Positioning contrast (design spec §4.5) — kills the "another AI tool"
 * objection by naming the two alternatives honestly before naming ours.
 */
export interface PositioningColumn {
  /** Mono kicker above the title — names what kind of option this is. */
  kicker: string
  title: string
  body: string
  /** What this option costs you. Rendered in a ledger footer across all three. */
  cost: string
  /** Where this option runs out — the honest failure mode of each path. */
  breaks: string
  /** The TryEntitle column: ink ground, seal accents, raised. */
  featured?: boolean
}

export const POSITIONING: PositioningColumn[] = [
  {
    kicker: 'Alternative',
    title: 'Do it yourself',
    body: 'You already know where the mess is. You just don’t have three months to fix it.',
    breaks: 'Time you don’t have',
    cost: 'The work doesn’t get done',
  },
  {
    kicker: 'Alternative',
    title: 'Buy a generic AI tool',
    body: 'Great demo. Then it hits your actual edge cases and someone quietly goes back to the spreadsheet.',
    breaks: 'Your edge cases',
    cost: 'A subscription and a stalled rollout',
  },
  {
    kicker: 'What we do',
    title: 'Work with TryEntitle',
    body: 'We map your real process, redesign it, build the automation, and stay on the exceptions.',
    breaks: 'Nothing — exceptions route to a person',
    cost: 'One fixed-scope engagement, then it runs',
    featured: true,
  },
]
