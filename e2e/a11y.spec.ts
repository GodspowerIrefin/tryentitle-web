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
        /*
         * The wordmark is exempt, and only the wordmark.
         *
         * WCAG 1.4.3 excludes logotypes from the contrast minimum, and "Try" is
         * set in raw seal — ~2.6:1 on the cream header and footer — because it
         * IS the brand mark. axe cannot know that, so without this exclusion the
         * gate reports two permanent serious violations on every route and stops
         * being able to tell anyone about a real one.
         *
         * Scoped to `.logo__word-try` deliberately. It does NOT cover the words
         * around the mark: raw seal on paper anywhere else is a genuine failure
         * and must still fail here.
         */
        .exclude('.logo__word-try')
        .analyze()

      const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      )

      /*
       * Report the offending NODES, not just a count. "color-contrast: 1
       * node(s)" tells whoever broke it nothing — they then have to rebuild and
       * re-scan by hand to find out which element and by how much. axe already
       * knows both; this just stops throwing that away.
       */
      expect(
        blocking.flatMap((v) =>
          v.nodes.map(
            (n) =>
              `${v.id} (${v.impact}) at ${n.target.join(' ')} — ` +
              [...n.any, ...n.all].map((c) => c.message.replace(/\s+/g, ' ')).join('; '),
          ),
        ),
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
