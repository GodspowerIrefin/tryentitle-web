<script setup lang="ts">
/**
 * Industries overview — the premium design's page: a large orange featured card
 * for the first industry, then a ruled grid of the rest.
 */
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { INDUSTRIES } from '@/data/industries'
import { buildHead, jsonLd } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

useHead({
  ...buildHead({
    title: 'Industries',
    description:
      'Document-heavy operations for healthcare, legal, insurance, accounting, real estate, construction, and professional services.',
    path: '/industries',
    image: '/og/industries.png',
  }),
  script: [
    jsonLd(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
      ]),
    ),
  ],
})

/** Healthcare's pulse glyph, as drawn in the design. */
const FEATURED_ICON = 'M3 12h4l2-5 3 10 2-5h4'

const featured = INDUSTRIES[0]!
/** Professional Services reads as its workflow list, exactly as in the design. */
const rest = INDUSTRIES.slice(1).map((ind) => ({
  ...ind,
  blurb: ind.slug === 'professional-services' ? ind.workflows.join(' · ') : ind.outcome,
}))
</script>

<template>
  <section class="intro">
    <p class="eyebrow">Industries</p>
    <h1 class="intro__title">Where this work does the most good.</h1>
  </section>

  <section class="featured-wrap">
    <RouterLink :to="`/industries/${featured.slug}`" class="featured">
      <span class="featured__icon" aria-hidden="true">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path :d="FEATURED_ICON" />
        </svg>
      </span>
      <h2 class="featured__name">{{ featured.name }}</h2>
      <p class="featured__blurb">{{ featured.outcome }}</p>
      <span class="featured__more">Learn more <span class="featured__arrow" aria-hidden="true">→</span></span>
    </RouterLink>
  </section>

  <section class="grid-wrap">
    <div class="grid">
      <RouterLink
        v-for="ind in rest"
        :key="ind.slug"
        :to="`/industries/${ind.slug}`"
        class="card"
      >
        <h2 class="card__name">{{ ind.name }}</h2>
        <p class="card__blurb">{{ ind.blurb }}</p>
        <span class="card__more">Learn more</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
h1,
h2 {
  font-variation-settings: normal;
  line-height: normal;
  text-wrap: pretty;
}

.intro {
  max-width: 1240px;
  margin: 0 auto;
  padding: 80px 32px 40px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--stone-600);
}

.intro__title {
  font-weight: 300;
  font-size: clamp(40px, 5vw, 72px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  margin-top: 22px;
  max-width: 22ch;
}

.featured-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px 24px;
}

.featured {
  display: block;
  background: var(--orange);
  color: var(--black);
  padding: 64px 64px 68px;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 24px 60px -28px color-mix(in srgb, var(--orange) 55%, transparent);
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.3, 1),
    box-shadow 0.35s;
}

.featured:hover {
  color: var(--black);
  box-shadow: 0 34px 80px -30px color-mix(in srgb, var(--orange) 70%, transparent);
  transform: translateY(-3px);
}

.featured__icon {
  width: 66px;
  height: 66px;
  border-radius: 14px;
  background: var(--charcoal);
  color: var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured__icon svg {
  width: 26px;
  height: 26px;
}

.featured__name {
  font-size: clamp(40px, 5.4vw, 68px);
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-top: 34px;
  color: var(--black);
}

.featured__blurb {
  font-size: 20px;
  line-height: 1.6;
  color: var(--charcoal);
  margin-top: 30px;
  max-width: 44ch;
}

.featured__more {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 36px;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--black);
}

.featured__arrow {
  font-size: 15px;
}

.grid-wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px 96px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1px;
  background: var(--stone-200);
  border: 1px solid var(--stone-200);
}

.card {
  display: flex;
  flex-direction: column;
  background: var(--paper);
  padding: 44px 44px 40px;
  color: var(--charcoal);
  min-height: 300px;
  text-decoration: none;
}

.card:hover {
  background: var(--stone-50);
}

.card__name {
  font-family: var(--font-body);
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.card__blurb {
  font-size: 17px;
  line-height: 1.65;
  color: var(--stone-700);
  margin-top: 22px;
  flex: 1;
}

.card__more {
  margin-top: 30px;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--orange-text);
}

@media (max-width: 640px) {
  .intro {
    padding: 56px 20px 32px;
  }
  .featured-wrap {
    padding: 0 20px 20px;
  }
  .featured {
    padding: 40px 28px 44px;
  }
  .grid-wrap {
    padding: 0 20px 72px;
  }
  .card {
    padding: 32px 26px 30px;
    min-height: 0;
  }
}
</style>
