<script setup lang="ts">
/**
 * ClosingCta (PRD FR13)
 *
 * The repeated closing call to action at the bottom of a page. Distinct copy
 * from the hero, same booking destination. Rendered on the dark canvas — one of
 * exactly two dark bands site-wide (the other is the footer), so the shift reads
 * as punctuation (PRD §10.3). Presentational; copy via props.
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Heading from '@/components/primitives/Heading'
import BookingButton from '@/components/marketing/BookingButton'
import AmbientScene from '@/components/three/AmbientScene.vue'

withDefaults(
  defineProps<{
    title: string
    body: string
    placement?: string
    /** Optional atmospheric photo under the dark wash. */
    image?: { src: string; alt: string }
  }>(),
  { placement: 'closing' },
)
</script>

<template>
  <Section tone="inverse" class="closing-band" labelledby="closing-title">
    <div v-if="image" class="closing__backdrop" aria-hidden="true">
      <img
        class="closing__photo"
        :src="image.src"
        :alt="image.alt"
        width="2000"
        height="1200"
        loading="lazy"
        decoding="async"
      />
    </div>
    <AmbientScene tone="dark" class="closing__ambient" />
    <Container>
      <div class="closing">
        <Heading id="closing-title" :level="2" size="display-lg" class="closing__title">
          {{ title }}
        </Heading>
        <p class="closing__body">{{ body }}</p>
        <div class="closing__action">
          <BookingButton :placement="placement" size="lg" />
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.closing-band {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.closing__backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.closing__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.28;
}

.closing__backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    var(--bg-inverse) 0%,
    color-mix(in srgb, var(--bg-inverse) 88%, transparent) 55%,
    color-mix(in srgb, var(--bg-inverse) 72%, transparent) 100%
  );
}

/* Ambient 3D network drifts behind the closing CTA, faded toward the copy so
   it never competes with the text. */
.closing__ambient {
  z-index: 0;
  mask-image: linear-gradient(90deg, transparent 0%, black 45%, black 100%);
}

.closing-band :deep(.container) {
  position: relative;
  z-index: 1;
}

.closing {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 52ch;
}

.closing__title {
  color: var(--text-inverse);
}

.closing__body {
  color: var(--color-graphite-300);
  font-size: var(--text-body-lg);
}

.closing__action {
  margin-top: var(--space-2);
}
</style>
