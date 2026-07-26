<script setup lang="ts">
/**
 * IndustriesGrid (PRD FR10)
 *
 * The seven target industries, each linking to its detail page, plus an explicit
 * note that the list is not exhaustive. A set, not a sequence — no numbering
 * (PRD §10.7). Presentational; data via props (PRD §11.3 rule 3).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Card from '@/components/primitives/Card'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import type { IndustrySummary } from '@/data/industries'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
  /** The explicit "not exhaustive" note required by FR10. */
  note: string
  items: IndustrySummary[]
  /** Heading level for the section lead. Home uses 2; the industries overview
   *  page passes 1. */
  level?: 1 | 2 | 3
}>()
</script>

<template>
  <Section tone="surface" labelledby="industries-title">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        title-id="industries-title"
        :intro="intro"
        :level="level"
      />
      <ul class="industries">
        <li v-for="industry in items" :key="industry.slug">
          <Card :to="`/industries/${industry.slug}`" flush class="industry">
            <div class="industry__media" aria-hidden="true">
              <img
                class="industry__image"
                :src="industry.image"
                alt=""
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="industry__body">
              <h3 class="industry__name">{{ industry.name }}</h3>
              <p class="industry__blurb">{{ industry.blurb }}</p>
              <Icon class="industry__arrow" name="arrow-up-right" :size="18" />
            </div>
          </Card>
        </li>
      </ul>
      <p class="industries__note">{{ note }}</p>
    </Container>
  </Section>
</template>

<style scoped>
.industries {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .industries {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .industries {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.industry {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  overflow: hidden;
}

.industry__media {
  position: relative;
  overflow: hidden;
  background-color: var(--color-ink-900);
}

.industry__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      160deg,
      color-mix(in srgb, var(--color-signal-600) 28%, transparent) 0%,
      color-mix(in srgb, var(--color-ink-900) 35%, transparent) 100%
    );
  pointer-events: none;
}

.industry__image {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  filter: saturate(0.65) contrast(1.08);
  opacity: 0.92;
}

.industry__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5);
  flex: 1 0 auto;
}

.industry__name {
  font-family: var(--font-body);
  font-size: var(--text-heading-sm);
  font-weight: 600;
  max-width: 22ch;
  padding-inline-end: var(--space-6);
}

.industry__blurb {
  color: var(--text-secondary);
  font-size: var(--text-body-sm);
}

.industry__arrow {
  position: absolute;
  top: var(--space-5);
  inset-inline-end: var(--space-5);
  color: var(--text-tertiary);
}

.industries__note {
  margin-top: var(--space-5);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
</style>
