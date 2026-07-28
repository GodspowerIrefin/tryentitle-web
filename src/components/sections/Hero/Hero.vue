<script setup lang="ts">
/**
 * Hero — Ink band (design spec §4.2, PRD FR7)
 *
 * Comprehension in five seconds. Two columns on desktop: the statement and CTAs
 * on the left, the Live Workflow Strip on the right. The strip is the argument;
 * the copy names it.
 *
 * Presentational — all copy arrives via props (PRD §11.3 rule 4). Copy comes
 * first in the DOM and the CTA sits high, so it stays above the fold at 360×640
 * (FR7).
 */
import { onMounted, ref } from 'vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Button from '@/components/primitives/Button'
import BookingButton from '@/components/marketing/BookingButton'
import WorkflowStrip from '@/components/marketing/WorkflowStrip'

defineProps<{
  eyebrow: string
  title: string
  subhead: string
  /** Micro-trust row — short mono claims under the CTAs. */
  meta?: readonly string[]
  secondaryLabel?: string
}>()

/**
 * The hero uses an ON-LOAD entrance, not the site's scroll-reveal system: it is
 * already in view at first paint, so a scroll-triggered reveal would either fire
 * instantly (pointless) or leave the h1 hidden until the visitor scrolled (awful).
 * Set on the next frame so the transition has an initial state to move from.
 */
const revealed = ref(false)
onMounted(() => {
  requestAnimationFrame(() => (revealed.value = true))
})
</script>

<template>
  <Section as="section" tone="ink" class="hero" labelledby="hero-title">
    <Container class="hero__grid">
      <div class="hero__copy" :class="{ 'is-revealed': revealed }">
        <Eyebrow class="hero__step" style="--i: 0">{{ eyebrow }}</Eyebrow>

        <Heading
          id="hero-title"
          :level="1"
          size="h1"
          class="hero__title hero__step"
          style="--i: 1"
        >
          {{ title }}
        </Heading>

        <p class="hero__subhead hero__step" style="--i: 2">{{ subhead }}</p>

        <div class="hero__actions hero__step" style="--i: 3">
          <BookingButton placement="hero" size="lg" />
          <Button to="/services" variant="secondary" size="lg">
            {{ secondaryLabel ?? 'See how it works' }}
          </Button>
        </div>

        <ul v-if="meta?.length" class="hero__trust hero__step" style="--i: 4">
          <li v-for="claim in meta" :key="claim" class="mono-label">{{ claim }}</li>
        </ul>
      </div>

      <div class="hero__visual hero__step" :class="{ 'is-revealed': revealed }" style="--i: 5">
        <WorkflowStrip />
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.hero {
  /* Slightly tighter at the top than a standard band — the header sits over it
     and the fold needs the CTA. */
  padding-block: clamp(2.5rem, 2rem + 4vw, 5rem) var(--section-rhythm);
}

.hero__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: flex-start;
}

/* The measure lives on the headline, never on the flex parent — constraining
   the parent would squeeze the subhead, buttons, and trust row to match. */
.hero__title {
  max-width: 15ch;
}

.hero__subhead {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-lg);
  max-width: 52ch;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.hero__trust {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  align-self: stretch;
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-ink);
}

.hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-on-ink-muted);
}

/* Per-item marker rather than dividers between items: a divider on the first
   item of a wrapped second line detaches and reads as a stray mark. */
.hero__trust li::before {
  content: '';
  width: 5px;
  height: 5px;
  flex: none;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
}

.hero__visual {
  margin-top: var(--space-8);
}

/* One composed entrance on load: a 10px rise cascading 60ms per element. Nothing
   loops and nothing re-triggers on scroll (spec §5).

   Transform only, no fade — for the same reason as the site-wide reveals: a
   contrast checker reads the blended colour of a fading element and reports the
   h1 and subhead as failures while the entrance runs. */
@media (prefers-reduced-motion: no-preference) {
  .hero__step {
    transform: translateY(10px);
    transition: transform var(--duration-slow) var(--ease-standard);
    transition-delay: calc(var(--i, 0) * 60ms);
  }

  .hero__copy.is-revealed .hero__step,
  .hero__visual.is-revealed {
    transform: translateY(0);
  }
}

@media (min-width: 1000px) {
  .hero__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: clamp(var(--space-6), 4vw, var(--space-9));
    align-items: center;
  }

  .hero__visual {
    margin-top: 0;
  }
}
</style>
