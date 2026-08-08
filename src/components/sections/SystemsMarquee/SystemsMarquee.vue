<script setup lang="ts">
/**
 * SystemsMarquee — Ink band (design spec §4.3)
 *
 * A scrolling row of SYSTEM names, not client logos. Same visual credibility as
 * a customer wall, completely honest, and it doubles as qualification — the
 * visitor spots their own stack and self-identifies.
 *
 * Rendered as text rather than third-party marks: the spec names a plain text
 * row as the safe fallback where logo licensing is unresolved (§4.3).
 *
 * Motion: two rows drifting in opposite directions, paused on hover AND on
 * focus-within so a keyboard user can read a name without it sliding away.
 * Under `prefers-reduced-motion` the animation does not run and the rows render
 * as static wrapped lists.
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import { SYSTEMS } from '@/data/systems'

defineProps<{ label: string }>()

// Split into two rows, then duplicate each so the loop has no visible seam.
const half = Math.ceil(SYSTEMS.length / 2)
const rowA = SYSTEMS.slice(0, half)
const rowB = SYSTEMS.slice(half)
</script>

<template>
  <Section tone="ink" density="compact" class="marquee-band" aria-label="Systems we integrate with">
    <Container>
      <p class="marquee__label mono-label">{{ label }}</p>
    </Container>

    <div class="marquee">
      <div class="marquee__row">
        <ul v-for="copy in 2" :key="`a${copy}`" class="marquee__track" :aria-hidden="copy === 2">
          <li v-for="name in rowA" :key="`${copy}-${name}`">{{ name }}</li>
        </ul>
      </div>
      <div class="marquee__row marquee__row--reverse">
        <ul v-for="copy in 2" :key="`b${copy}`" class="marquee__track" :aria-hidden="copy === 2">
          <li v-for="name in rowB" :key="`${copy}-${name}`">{{ name }}</li>
        </ul>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.marquee__label {
  color: var(--text-on-ink-muted);
  text-align: center;
}

.marquee {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--stack-lead);
  /* REQUIRED: the rows are `width: max-content` and are wider than the viewport.
     Without this clip they push the page into horizontal scroll at every
     breakpoint (NFR1) — not just the narrow ones. */
  overflow: hidden;
  /* Fade the edges so names enter and leave rather than being clipped. */
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}

.marquee__row {
  display: flex;
  width: max-content;
  gap: var(--space-3);
}

.marquee__track {
  display: flex;
  gap: var(--space-3);
  flex: none;
}

.marquee__track li {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--ink);
  /* Explicit fill, not inherited: the `mask-image` above makes the ancestor
     background undeterminable to a contrast checker, which then assumes the body
     ground and reports a false failure. */
  background-color: var(--seal);
  border: 1px solid color-mix(in srgb, var(--ink) 18%, var(--seal));
  border-radius: var(--radius-chip);
  padding: var(--space-2) var(--space-4);
  white-space: nowrap;
  transition: color var(--duration-fast) var(--ease-standard);
}

.marquee__track li:hover {
  color: var(--ink);
}

@media (prefers-reduced-motion: no-preference) {
  .marquee__row {
    animation: drift 46s linear infinite;
  }

  .marquee__row--reverse {
    animation-direction: reverse;
  }

  /* Pause on hover, and on focus-within so keyboard users are not chasing a
     moving target. */
  .marquee:hover .marquee__row,
  .marquee:focus-within .marquee__row {
    animation-play-state: paused;
  }
}

/* Each row holds two identical tracks; shifting by exactly half the row width
   returns to the starting frame, so the loop has no seam. */
@keyframes drift {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - var(--space-2)));
  }
}

/* Without motion the rows must not overflow — wrap them instead. */
@media (prefers-reduced-motion: reduce) {
  .marquee {
    mask-image: none;
  }

  .marquee__row {
    width: auto;
    flex-wrap: wrap;
    justify-content: center;
  }

  .marquee__track {
    flex-wrap: wrap;
    justify-content: center;
  }

  /* The duplicate track exists only to seam the loop. */
  .marquee__track[aria-hidden='true'] {
    display: none;
  }
}
</style>
