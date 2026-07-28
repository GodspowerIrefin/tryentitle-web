import { test, expect } from '@playwright/test'
import { ROUTES } from './routes'

/**
 * Route smoke tests:
 * - NFR3: no console errors or warnings in the production build.
 * - NFR5: exactly one h1 per page, and a main landmark.
 * - FR3:  no dead or `#` internal links.
 * - FR18: the blog index renders an honest empty state rather than 404ing.
 */

test.describe('every route', () => {
  for (const route of ROUTES) {
    test(`${route} renders without console errors`, async ({ page }) => {
      const problems: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          // Ignore the headless software-GL driver's performance hints. These
          // are emitted by Chromium's SwiftShader/ANGLE backend when WebGL runs
          // without a real GPU (CI, headless) — not by the app or Three.js, and
          // never on real hardware. Every other warning/error still fails (NFR3).
          if (/GL Driver Message.*Performance/i.test(msg.text())) return
          problems.push(`${msg.type()}: ${msg.text()}`)
        }
      })
      page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`))

      const response = await page.goto(route)
      expect(response?.status(), `${route} should return 200`).toBe(200)

      // One h1 per page, in a main landmark (NFR5).
      await expect(page.locator('main')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveCount(1)

      expect(problems, `console output on ${route}`).toEqual([])
    })
  }
})

test('no internal link is dead or a bare #', async ({ page }) => {
  const seen = new Set<string>()

  for (const route of ROUTES) {
    await page.goto(route)
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((links) =>
        links.map((l) => l.getAttribute('href') ?? '').filter((h) => h.startsWith('/') || h === '#'),
      )
    for (const href of hrefs) {
      expect(href, `bare "#" href found on ${route}`).not.toBe('#')
      seen.add(href.split('#')[0]!)
    }
  }

  // Every internal destination must actually resolve.
  for (const href of seen) {
    if (!href) continue
    const res = await page.request.get(href)
    expect(res.status(), `${href} should resolve`).toBeLessThan(400)
  }
})

test('blog index shows an honest empty state, not a 404 or fake posts', async ({ page }) => {
  const res = await page.goto('/blog')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // No post cards when the collection is empty.
  await expect(page.locator('.post__title')).toHaveCount(0)
})

test('404 route returns a custom not-found page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/isn.t here/i)
})
