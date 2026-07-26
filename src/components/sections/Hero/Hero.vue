<script setup lang="ts">
/**
 * Hero (PRD FR7)
 *
 * Full-bleed dark hero: the 3D WorkflowScene fills the background and the copy
 * (eyebrow, headline, subhead, CTA, meta chips) is overlaid on the left over a
 * scrim that keeps the pipeline weighted to the right, clear of the text. The
 * scene is lazy Three.js with the revamped ExceptionRail SVG as its
 * static/reduced-motion/no-WebGL fallback, centred in the frame.
 *
 * Presentational — copy/media via props (PRD §11.3 rules 3–4). Copy comes first
 * in the DOM and the CTA sits high, so it stays above the fold at 360×640 (FR7).
 * The `image` prop is accepted for compatibility but the dark hero no longer
 * renders a photo; the scene is the visual.
 */
import { onMounted, ref } from 'vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Button from '@/components/primitives/Button'
import BookingButton from '@/components/marketing/BookingButton'
import ExceptionRail from '@/components/marketing/ExceptionRail'
import WorkflowScene from '@/components/three/WorkflowScene.vue'

defineProps<{
  eyebrow: string
  title: string
  subhead: string
  meta?: readonly string[]
  image?: { src: string; alt: string }
}>()

const revealed = ref(false)
onMounted(() => {
  requestAnimationFrame(() => (revealed.value = true))
})
</script>

<template>
  <Section
    as="section"
    tone="inverse"
    class="hero-band"
    labelledby="hero-title"
    aria-label="Introduction"
  >
    <div class="hero__grid" aria-hidden="true" />
    <WorkflowScene cover class="hero__scene">
      <ExceptionRail tone="dark" />
    </WorkflowScene>
    <div class="hero__scrim" aria-hidden="true" />

    <Container>
      <div class="hero__copy" :class="{ 'is-revealed': revealed }">
        <Eyebrow class="hero__eyebrow">{{ eyebrow }}</Eyebrow>
        <Heading id="hero-title" :level="1" size="display-xl" class="hero__title">
          {{ title }}
        </Heading>
        <p class="hero__subhead">{{ subhead }}</p>

        <div class="hero__actions">
          <BookingButton placement="hero" size="lg" />
          <Button to="/services" variant="secondary" size="lg">See what we do</Button>
        </div>

        <ul v-if="meta?.length" class="hero__meta">
          <li v-for="tag in meta" :key="tag">{{ tag }}</li>
        </ul>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.hero-band {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: clamp(560px, 82vh, 780px);
  display: flex;
  align-items: center;
}

/* Faint engineering grid for depth, behind the scene. */
.hero__grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--color-rule) 6%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-rule) 6%, transparent) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(120% 120% at 70% 40%, black 30%, transparent 80%);
}

.hero__scene {
  z-index: 0;
}

/* Left-weighted scrim keeps the overlaid copy legible while the pipeline on the
   right stays fully visible; a floor gradient seats the scene on the band. */
.hero__scrim {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(
      100deg,
      var(--bg-inverse) 0%,
      var(--bg-inverse) 44%,
      color-mix(in srgb, var(--bg-inverse) 62%, transparent) 60%,
      transparent 76%
    ),
    linear-gradient(to top, var(--bg-inverse) 0%, transparent 20%);
}

.hero-band :deep(.container) {
  position: relative;
  z-index: 1;
}

.hero__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 60ch;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard);
}

.hero__copy.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Light-on-dark treatment for the overlaid copy. `:deep` + the parent selector
   outweighs the Eyebrow/Heading components' own colour rules. */
.hero__copy :deep(.eyebrow) {
  color: var(--color-graphite-300);
}

.hero__copy :deep(.heading) {
  color: var(--text-inverse);
}

.hero__subhead {
  color: var(--color-graphite-300);
  font-size: var(--text-body-lg);
  max-width: var(--measure);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

/* Secondary CTA reads as a light outline on the dark hero. */
.hero__actions :deep(.btn--secondary) {
  color: var(--text-inverse);
  border-color: color-mix(in srgb, var(--text-inverse) 40%, transparent);
}

.hero__actions :deep(.btn--secondary:hover) {
  color: var(--text-inverse);
  border-color: var(--text-inverse);
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  margin-top: var(--space-1);
}

.hero__meta li {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-signal-500) 55%, var(--color-paper));
  border: 1px solid color-mix(in srgb, var(--color-signal-500) 45%, transparent);
  background-color: color-mix(in srgb, var(--color-signal-600) 18%, transparent);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
}

/* On small screens the scene sits behind the copy; a top-down scrim keeps the
   text readable and the pipeline reads in the lower half. */
@media (max-width: 860px) {
  .hero-band {
    min-height: clamp(620px, 92vh, 860px);
    align-items: flex-start;
  }

  .hero__scrim {
    background:
      linear-gradient(
        to bottom,
        var(--bg-inverse) 0%,
        var(--bg-inverse) 32%,
        color-mix(in srgb, var(--bg-inverse) 55%, transparent) 58%,
        transparent 80%
      ),
      linear-gradient(to top, var(--bg-inverse) 0%, transparent 26%);
  }
}
</style>
