import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

/**
 * E2E configuration (PRD §12.5).
 *
 * Tests always run against the PRODUCTION BUILD served by `vite preview`, not
 * the dev server. The acceptance criteria that matter here — no console errors,
 * one booking destination across the built site, prerendered markup — are
 * properties of the built output, so testing the dev server would test the wrong
 * artifact.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    headless: true,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Mobile viewport drives the hamburger/panel behaviour (FR1, §6.1, NFR5).
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],

  webServer: {
    // Static-host semantics (clean URLs + real 404 status), not SPA fallback.
    command: 'node scripts/serve-dist.mjs',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
