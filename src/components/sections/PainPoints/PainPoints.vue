<script setup lang="ts">
/**
 * PainPoints — "The cost of manual work", Ink band (design spec §4.4, PRD FR8)
 *
 * Five leaks in a 3+2 layout, each on the standard card anatomy with a redline
 * stat chip in the corner. Redline appears here and in the workflow strip's
 * before-state only, so red always means "this is costing you".
 *
 * Presentational; items arrive via props (PRD §11.3 rule 3).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import FeatureCard from '@/components/sections/FeatureCard'
import SectionHeader from '@/components/sections/SectionHeader'
import type { PainPoint } from '@/data/pain-points'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
  items: PainPoint[]
}>()
</script>

<template>
  <Section tone="ink" labelledby="painpoints-title">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        title-id="painpoints-title"
        :intro="intro"
      />

      <ul class="leaks">
        <li v-for="item in items" :key="item.id" data-reveal>
          <FeatureCard
            :title="item.label"
            :body="item.symptom"
            :icon="item.icon"
            :stat="item.stat"
            stat-tone="redline"
          />
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
.leaks {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .leaks {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 3 + 2: the last two cards each span 1.5 columns of a 6-track grid so the
   second row centres instead of leaving a ragged hole (spec §4.4). */
@media (min-width: 1000px) {
  .leaks {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .leaks > li {
    grid-column: span 2;
  }

  .leaks > li:nth-child(4),
  .leaks > li:nth-child(5) {
    grid-column: span 3;
  }
}
</style>
