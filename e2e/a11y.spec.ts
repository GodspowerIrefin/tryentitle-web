import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ROUTES } from './routes'

/**
 * NFR5 — WCAG 2.2 AA. Zero serious or critical axe violations on every route.
 *
 * Automated scanning catches roughly half of real accessibility defects; the
 * manual keyboard pass in navigation.spec.ts and the PR checklist (§12.7) cover
 * the rest.
 */

test.describe('accessibility', () => {
  for (const route of ROUTES) {
    test(`${route} has no serious or critical violations`, async ({ page }) => {
      await page.goto(route)

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()

      const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      )

      expect(
        blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.help}`),
        `axe violations on ${route}`,
      ).toEqual([])
    })
  }
})

test('the open mobile menu is accessible', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) >= 860, 'mobile only')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeVisible()

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([])
})
