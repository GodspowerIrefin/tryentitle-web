# Contributing

Standards for this repository, from PRD §12. They exist to keep a small site
feeling deliberately built rather than assembled.

## Branches and commits

- `main` is always deployable and protected.
- Work on `feat/*`, `fix/*`, or `chore/*`.
- [Conventional Commits](https://www.conventionalcommits.org/). Squash merge —
  the PR title becomes the commit message.

```
feat(home): add process rail with named client inputs
fix(nav): return focus to the toggle when the mobile panel closes
```

## The component contract

Non-negotiable, enforced in review:

1. **One component per directory**, with a barrel `index.ts` and its test
   alongside. No 400-line files.
2. **Three layers, one direction of dependency**: `primitives` ← `sections` ←
   `pages`. A primitive must never import a section; a section must never import
   a page.
3. **Sections are presentational.** They receive data as props and do no
   fetching, file reading, or content parsing. Data is resolved in the page and
   passed down, so every section renders in a test from a fixture.
4. **No hardcoded copy in `sections`.** Copy lives in `content/` or `data/`. A
   copy change must never require touching a component.
5. **No raw colour, font-size, or spacing values** in component code — tokens
   only. `src/styles/tokens.css` is the only file permitted to contain a hex value.
6. **Every exported component carries a TSDoc block** saying what it is, when to
   use it, and any accessibility contract it holds.
7. **Push interactivity to the smallest leaf.** The mobile nav toggle owns its
   state; the header does not become interactive because of it.

## CSS discipline

The most common failure mode in a marketing build is competing vertical spacing.
Guard against it structurally:

- **`Section` owns all vertical rhythm.** No `padding-block` or `margin-block`
  on page bands anywhere else.
- Prefer `gap` on flex/grid parents over margins on children. Never a bare
  `margin-top` on a shared component.
- No `!important`. No selector nesting deeper than two levels.
- `Prose` is the only place descendant element selectors are allowed, scoped to
  rendered Markdown.

## Design guardrails

These read as machine-generated and are banned (PRD §10.2):

- Purple/violet or indigo → cyan gradients, "aurora" blurs, glowing orbs
- Full-bleed dark hero with a single acid-green or vermilion accent
- Generative stock imagery: neural meshes, glowing brains, robot hands, 3D blobs
- Stock photography of teams pointing at laptops
- Glassmorphism, heavy drop shadows, 16px+ radii, emoji as iconography
- Fake dashboard screenshots with invented metrics
- Entrance animations on every section — the loudest tell there is

Two rules that carry the brand:

- **Brass is only ever "a human is involved here."** At most twice per viewport,
  and never for body text (use `--accent-exception-text` when it must be text).
- **Dark bands are punctuation.** Exactly two site-wide: the closing CTA and the
  footer.

## Honesty rules

- **Never fabricate proof.** No placeholder logos, no invented quotes, no
  "trusted by" grey boxes. The proof section renders nothing until real,
  permissioned testimonials exist.
- **Industry pages must be industry-true.** Each names real artifacts from that
  field — lien waivers, ACORD forms, prior-authorization packets. A
  find-and-replaced industry page actively destroys credibility with the exact
  reader we want.
- **Never publish unreviewed legal text.** Legal documents stay `reviewed: false`
  until counsel signs off.
- **The security page states only what is true.** A security page that overstates
  is a liability, not a credibility asset.

## Testing

Query by role and accessible name, never by test id:

```ts
page.getByRole('link', { name: /book a workflow review/i })
```

A test that passes while a screen reader user is stuck is a test that lied.

Run before opening a PR:

```bash
npm run type-check && npm run lint && npx vitest run && npm run build && npm run test:e2e
```

## Pull request checklist

- [ ] Typecheck, lint, and tests pass locally
- [ ] No hardcoded colours, font sizes, spacing values, or copy in components
- [ ] New/changed components carry a TSDoc block
- [ ] Keyboard-only pass on the changed surface; focus visible throughout
- [ ] Checked at 360px and 1440px
- [ ] No new console output in production mode
- [ ] No `any`, no unexplained `eslint-disable`, no commented-out code
- [ ] Nothing from the §10.2 forbidden list crept in
