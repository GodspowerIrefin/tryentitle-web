import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { testimonialSchema } from '../src/types/content'

/**
 * proofGuard — validates the proof collection at build time (PRD FR12 / §8.4).
 *
 * Every `content/proof/*.json` must name a real person, role, and company and
 * carry explicit `permission: true`. An anonymous or unpermitted testimonial
 * fails the build rather than shipping, because an anonymous testimonial lowers
 * credibility rather than raising it.
 *
 * Running this in Node (instead of at module scope in the app) keeps zod and the
 * schema out of the client bundle — the home page ships no validation code.
 */
export function proofGuard(): Plugin {
  return {
    name: 'tryentitle:proof-guard',
    buildStart() {
      const dir = fileURLToPath(new URL('../src/content/proof/', import.meta.url))
      if (!existsSync(dir)) return

      for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
        let parsed: unknown
        try {
          parsed = JSON.parse(readFileSync(dir + file, 'utf-8'))
        } catch (err) {
          throw new Error(`proof/${file} is not valid JSON: ${(err as Error).message}`)
        }

        const result = testimonialSchema.safeParse(parsed)
        if (!result.success) {
          const issues = result.error.issues
            .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
            .join('\n')
          throw new Error(
            `proof/${file} is not a publishable testimonial.\n${issues}\n` +
              `Every testimonial needs a named person, role, company, and written permission (PRD §8.4).`,
          )
        }
      }
    },
  }
}
