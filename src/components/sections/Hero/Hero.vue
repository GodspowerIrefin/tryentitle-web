<script setup lang="ts">
/**
 * Hero — Bond band (PRD FR7)
 *
 * Comprehension in five seconds. Off-white paper ground with the SVG flow-field
 * pattern (HeroPattern) only — no Three.js layer competing with the rails.
 * The Live Workflow Strip stays the ink argument beside / below the copy.
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
import BookingButton from '@/components/marketing/BookingButton'
import WorkflowStrip from '@/components/marketing/WorkflowStrip'
import HeroPattern from './HeroPattern.vue'
import { splitLines } from '@/lib/motion/split'

defineProps<{
  eyebrow: string
  title: string
  subhead: string
  /** Micro-trust row — short mono claims under the CTAs. */
  meta?: readonly string[]
  secondaryLabel?: string
}>()

const revealed = ref(false)
const copy = ref<HTMLElement | null>(null)

onMounted(() => {
  requestAnimationFrame(() => (revealed.value = true))

  void (document.fonts?.ready ?? Promise.resolve()).then(() => {
    const heading = copy.value?.querySelector('h1')
    if (heading && splitLines(heading)) {
      requestAnimationFrame(() => heading.classList.add('is-split-in'))
    }
  })
})
</script>

<template>
  <Section as="section" tone="bond" class="hero" labelledby="hero-title">
    <!-- Atmosphere: flow-field rails only (decorative; never carry meaning). -->
    <div class="hero__atmosphere" aria-hidden="true">
      <HeroPattern />
    </div>

    <Container class="hero__grid-layout">
      <!-- `data-flow-copy` is read by HeroPattern: the scattered inbound routes
           run through the band above this column, and they need its real top
           edge rather than a guess at where the type lands. -->
      <div ref="copy" class="hero__copy" :class="{ 'is-revealed': revealed }" data-flow-copy>
        <!-- Home passes an empty eyebrow; an empty <p> would still take its gap. -->
        <Eyebrow v-if="eyebrow" class="hero__step" style="--i: 0">{{ eyebrow }}</Eyebrow>

        <Heading id="hero-title" :level="1" size="h1" class="hero__title hero__step" style="--i: 1">
          {{ title }}
        </Heading>

        <p class="hero__subhead hero__step" style="--i: 2">{{ subhead }}</p>

        <div class="hero__actions hero__step" style="--i: 3">
          <BookingButton placement="hero" size="lg" data-magnetic />
        </div>

        <ul v-if="meta?.length" class="hero__trust hero__step" style="--i: 4">
          <li v-for="claim in meta" :key="claim">{{ claim }}</li>
        </ul>
      </div>

      <div
        class="hero__visual hero__step"
        :class="{ 'is-revealed': revealed }"
        style="--i: 5"
        data-parallax="-0.08"
      >
        <WorkflowStrip />
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  overflow: clip;
  padding-block: clamp(2.5rem, 2rem + 4vw, 5rem) var(--section-rhythm);
  background-color: var(--bond);
}

.hero__atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero__grid-layout {
  position: relative;
  z-index: 1;
}

.hero__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: flex-start;
}

.hero__title {
  max-width: 15ch;
}

.hero__subhead {
  color: var(--text-on-bond-muted);
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
  border-top: 1px solid var(--rule-on-bond);
}

.hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-on-bond-muted);
}

.hero__trust li::before {
  content: '';
  width: 5px;
  height: 5px;
  flex: none;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
}

.hero__visual {
  position: relative;
  margin-top: var(--space-8);
  z-index: 1;
}

.hero__cue {
  display: none;
}

@media (min-width: 1000px) {
  .hero__cue {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    position: absolute;
    bottom: var(--space-6);
    left: max(var(--gutter), calc(50% - var(--content-max) / 2));
    color: var(--text-on-bond-muted);
  }

  .hero__cue-rail {
    display: block;
    position: relative;
    width: 1px;
    height: 40px;
    background-color: var(--rule-on-bond);
  }

  .hero__cue-dot {
    position: absolute;
    inset-inline-start: -1px;
    top: 0;
    width: 3px;
    height: 8px;
    background-color: var(--seal);
  }
}

@media (min-width: 1000px) and (prefers-reduced-motion: no-preference) {
  .hero__cue {
    transform: translateY(10px);
    transition: transform var(--duration-slow) var(--ease-standard);
    transition-delay: 420ms;
  }

  .hero__cue.is-revealed {
    transform: translateY(0);
  }

  .hero__cue-dot {
    animation: hero-cue 2.4s var(--ease-standard) infinite;
  }
}

@keyframes hero-cue {
  0% {
    transform: translateY(0);
  }
  45%,
  100% {
    transform: translateY(32px);
  }
}

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
  .hero__grid-layout {
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
