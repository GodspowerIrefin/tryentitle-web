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
import { SITE_NAME } from '@/lib/constants'
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
        <p class="hero__brand hero__step" style="--i: 0">{{ eyebrow || SITE_NAME }}</p>

        <Heading id="hero-title" :level="1" size="h1" class="hero__title hero__step" style="--i: 1">
          {{ title }}
        </Heading>

        <div class="hero__foot hero__step" style="--i: 2">
          <p class="hero__subhead">{{ subhead }}</p>
          <div class="hero__actions">
            <BookingButton placement="hero" size="lg" data-magnetic />
          </div>
        </div>

        <ul v-if="meta?.length" class="hero__trust hero__step" style="--i: 3">
          <li v-for="claim in meta" :key="claim">{{ claim }}</li>
        </ul>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  overflow: clip;
  /* Full-viewport banner under the sticky header. */
  min-height: min(92vh, 52rem);
  padding-block: clamp(2rem, 4vw, 4rem);
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

/* Soft paper wash so the photo reads bright and the panel stays legible. */
.hero__wash {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(244, 243, 241, 0.72) 0%,
      rgba(244, 243, 241, 0.28) 42%,
      transparent 68%
    ),
    linear-gradient(
      180deg,
      rgba(244, 243, 241, 0.35) 0%,
      transparent 28%,
      rgba(244, 243, 241, 0.2) 100%
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
  width: min(100%, 38rem);
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
  padding-top: var(--space-2);
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

.hero__trust {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
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
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-6);
  }

  .hero__subhead {
    flex: 1;
    max-width: 28ch;
  }

  .hero__actions {
    flex: none;
  }
}

@media (min-width: 1000px) {
  .hero__panel {
    width: min(100%, 42rem);
    min-height: 22rem;
    padding: var(--space-8);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .hero__step {
    transform: translateY(12px);
    opacity: 0;
    transition:
      transform var(--duration-slow) var(--ease-standard),
      opacity var(--duration-slow) var(--ease-standard);
    transition-delay: calc(var(--i, 0) * 70ms);
  }

  .hero__panel.is-revealed .hero__step {
    transform: translateY(0);
    opacity: 1;
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
  .hero {
    min-height: auto;
    align-items: flex-end;
    padding-block: var(--space-6) var(--space-7);
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
