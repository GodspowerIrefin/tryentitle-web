/**
 * Site-wide constants — the single source of truth for identity and destinations.
 *
 * BOOKING_URL is consumed ONLY by the BookingButton component (PRD FR2). Every
 * CTA on the site renders through BookingButton, so changing the scheduler is a
 * one-line change here. An e2e test asserts a single unique booking origin across
 * the built site.
 */

/** Canonical production origin. Update alongside D2 (domain/DNS). */
export const SITE_URL = 'https://tryentitle.com'

export const SITE_NAME = 'TryEntitle'

export const SITE_TAGLINE = 'Workflows that move business forward'

/**
 * The single booking destination for the entire site.
 * [DECISION NEEDED · PRD D1] — replace <handle> with the real Calendly event.
 */
export const BOOKING_URL = 'https://calendly.com/tryentitle/workflow-review'

/** Human-readable label for the primary action, reused across placements. */
export const BOOKING_LABEL = 'Book Now'

/**
 * Contact addresses surfaced in legal pages and the footer.
 * [DECISION NEEDED · PRD D8] — confirm real inboxes before launch.
 */
export const CONTACT = {
  general: 'hello@tryentitle.com',
  privacy: 'privacy@tryentitle.com',
  security: 'security@tryentitle.com',
} as const

/**
 * Append a per-placement UTM tag so it is possible to learn which CTA converts
 * (PRD §11.6). `placement` is a free-form slug: hero | nav | closing | footer | …
 *
 * `extra` carries scheduler prefill values — the hours calculator passes its
 * computed figure through as `a1` so the call opens with the visitor's own
 * number already on the table (design spec §4.10).
 */
export function bookingUrl(placement: string, extra?: Record<string, string>): string {
  const url = new URL(BOOKING_URL)
  url.searchParams.set('utm_source', 'website')
  url.searchParams.set('utm_content', placement)
  for (const [key, value] of Object.entries(extra ?? {})) {
    if (value) url.searchParams.set(key, value)
  }
  return url.toString()
}
