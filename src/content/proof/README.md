# Proof collection

**This directory is intentionally empty at launch (PRD FR12 / §8.4).**

The `ProofStrip` section reads every `*.json` file here. While the folder is
empty, the section renders **nothing** — no skeletons, no greyed logo strips, no
"trusted by" placeholders, no invented quotes.

## Adding a real testimonial

A testimonial only earns a place here when it has a **named person, role, and
company, plus written permission**. The schema in `src/lib/proof.ts` enforces
this: `permission` must be literally `true`, and name/role/company are required.
An anonymous testimonial will fail the build — by design. An anonymous
testimonial lowers credibility rather than raising it (§8.4).

Create a file like `acme-co.json`:

```json
{
  "quote": "They cut our intake from three days to same-day.",
  "name": "Jane Doe",
  "role": "Operations Lead",
  "company": "Acme Co.",
  "permission": true
}
```
