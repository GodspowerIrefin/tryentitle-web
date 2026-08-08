<script setup lang="ts">
/**
 * Hero — Bond band (PRD FR7)
 *
 * Full-bleed workspace photograph with a left paper panel: brand, headline,
 * supporting line, and the orange booking pill. Layout nods to consulting
 * landing pages (photo field + inset statement) without inventing a second CTA.
 *
 * Presentational — all copy arrives via props (PRD §11.3 rule 4). CTA stays
 * above the fold at 360×640 (FR7).
 */
import { onMounted, ref } from 'vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Heading from '@/components/primitives/Heading'
import BookingButton from '@/components/marketing/BookingButton'
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
    <div class="hero__media" aria-hidden="true">
      <img
        class="hero__photo"
        src="/images/hero-office.jpg"
        alt=""
        width="2400"
        height="1600"
        decoding="async"
        fetchpriority="high"
      />
      <div class="hero__wash" />
    </div>

    <Container class="hero__frame">
      <div ref="copy" class="hero__panel" :class="{ 'is-revealed': revealed }">
        <div class="hero__head hero__step" style="--i: 1">
          <Heading id="hero-title" :level="1" size="h1" class="hero__title">
            {{ title }}
          </Heading>
          <p class="hero__subhead">{{ subhead }}</p>
        </div>

        <div class="hero__foot hero__step" style="--i: 2">
          <ul v-if="meta?.length" class="hero__trust"></ul>
          <div class="hero__actions">
            <BookingButton placement="hero" size="lg" data-magnetic />
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
/* `.section.hero`, not `.hero`: this is the one place a component overrides the
   rhythm Section owns, and at equal specificity the winner would depend on which
   scoped stylesheet the bundler emitted last. */
.section.hero {
  position: relative;
  isolation: isolate;
  overflow: clip;
  /* Full-viewport banner under the sticky header.

     The band is sized by `min-height` and centres its panel, so it deliberately
     runs tighter than the standard rhythm — this padding is only the floor that
     keeps the panel off the edges once the viewport is shorter than the banner.
     Taken from the compact step rather than a one-off clamp so it still moves
     with the rest of the scale. */
  min-height: min(92vh, 52rem);
  padding-block: var(--section-rhythm-compact);
  display: flex;
  align-items: center;
  background-color: var(--bond);
}

.hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hero__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/*
 * Soft paper wash so the photo reads bright and the panel stays legible.
 *
 * Even left to right, not the left-weighted ramp this had while the panel was an
 * inset card on the left third. The panel is translucent, so a sideways gradient
 * under a full-width card shows straight through it — the copy sat on bright
 * paper and the CTA end of the same card picked up the dark window frames behind
 * it. Only the vertical softening remains, which every column gets equally.
 */
.hero__wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(244, 243, 241, 0.42) 0%,
    rgba(244, 243, 241, 0.28) 38%,
    rgba(244, 243, 241, 0.42) 100%
  );
}

.hero__frame {
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero__panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  /* Full container width — the panel is the band, not an inset card on it. */
  width: 100%;
  padding: clamp(1.5rem, 3vw, 2.75rem);
  background-color: color-mix(in srgb, var(--bond-raised) 94%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 1.5rem;
  box-shadow: 0 24px 60px rgba(15, 31, 26, 0.12);
  backdrop-filter: blur(8px);
}

.hero__brand {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem);
  font-weight: 600;
  letter-spacing: var(--tracking-display);
  line-height: 1.05;
  color: var(--seal);
}

.hero__head {
  display: grid;
  gap: var(--space-5);
}

.hero__title {
  max-width: 12ch;
  color: var(--text-on-bond);
}

.hero__foot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  margin-top: auto;
  padding-top: var(--space-5);
  border-top: 1px solid var(--rule-on-bond);
}

.hero__subhead {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body);
  max-width: 36ch;
  line-height: var(--leading-body);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

/* The rule now belongs to the foot, which owns the whole base row. */
.hero__trust {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-5);
}

.hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-sm);
}

.hero__trust li::before {
  content: '';
  width: 5px;
  height: 5px;
  flex: none;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
}

@media (min-width: 720px) {
  .hero__foot {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-6);
  }

  .hero__trust {
    flex: 1;
  }

  .hero__actions {
    flex: none;
  }
}

@media (min-width: 1000px) {
  .hero__panel {
    min-height: 24rem;
    padding: var(--space-8);
  }
}

@media (prefers-reduced-motion: no-preference) {
  /* TRANSFORM ONLY — no opacity. See the note in ServiceHero and the reveal
     block in globals.css: a fade makes every contrast check inside the
     transition window measure a blended colour and fail intermittently. */
  .hero__step {
    transform: translateY(12px);
    transition: transform var(--duration-slow) var(--ease-standard);
    transition-delay: calc(var(--i, 0) * 70ms);
  }

  .hero__panel.is-revealed .hero__step {
    transform: translateY(0);
  }

  .hero__photo {
    transform: scale(1.04);
    transition: transform 1.2s var(--ease-standard);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .hero:has(.hero__panel.is-revealed) .hero__photo {
    transform: scale(1);
  }
}

@media (max-width: 719px) {
  /* Matches the specificity of the base rule above, which it has to override. */
  .section.hero {
    min-height: auto;
    align-items: flex-end;
    padding-block: var(--section-rhythm-compact);
  }

  .hero__wash {
    background: linear-gradient(
      180deg,
      transparent 18%,
      rgba(244, 243, 241, 0.55) 48%,
      rgba(244, 243, 241, 0.92) 100%
    );
  }

  .hero__panel {
    width: 100%;
    border-radius: 1.25rem;
  }
}
</style>
