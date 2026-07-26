import { test, expect } from '@playwright/test'
import { ROUTES } from './routes'

/**
 * FR2 — every CTA resolves to ONE booking destination.
 *
 * The acceptance criterion is "a single unique booking href across the built
 * site". Placement UTM parameters intentionally differ per CTA (§11.6), so the
 * invariant is asserted on origin + pathname: exactly one booking destination,
 * reached from every page.
 */

const BOOKING_HOST = 'calendly.com'

test.describe('booking destination', () => {
  test('exactly one booking destination exists across every route', async ({ page }) => {
    const destinations = new Set<string>()

    for (const route of ROUTES) {
      await page.goto(route)
      const hrefs = await page
        .locator(`a[href*="${BOOKING_HOST}"]`)
        .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).href))

      expect(hrefs.length, `expected at least one booking CTA on ${route}`).toBeGreaterThan(0)

      for (const href of hrefs) {
        const url = new URL(href)
        destinations.add(`${url.origin}${url.pathname}`)
      }
    }

    expect(
      Array.from(destinations),
      'all CTAs must resolve to a single booking destination',
    ).toHaveLength(1)
  })

  test('booking links are safe external links', async ({ page }) => {
    await page.goto('/')
    const links = page.locator(`a[href*="${BOOKING_HOST}"]`)
    const count = await links.count()

    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
      // Prevents the opened tab from gaining access to window.opener.
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
  })

  test('each CTA is tagged with its placement for attribution', async ({ page }) => {
    await page.goto('/')
    const hrefs = await page
      .locator(`a[href*="${BOOKING_HOST}"]`)
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).href))

    for (const href of hrefs) {
      expect(new URL(href).searchParams.get('utm_content')).toBeTruthy()
    }
  })
})
