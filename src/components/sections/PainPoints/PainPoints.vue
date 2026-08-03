<script setup lang="ts">
/**
 * PainPoints — "Where the hours go", Ink band (design spec §4.4, PRD FR8)
 *
 * Six cards in a 3×2 grid on desktop. Each uses the shared FeatureCard anatomy
 * with a redline time chip — redline here means "this is costing you".
 *
 * Presentational; items arrive via props (PRD §11.3 rule 3).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import FeatureCard from '@/components/sections/FeatureCard'
import SectionHeader from '@/components/sections/SectionHeader'
import type { PainPoint } from '@/data/pain-points'

defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  items: PainPoint[]
}>()
</script>

<template>
  <Section tone="ink" labelledby="painpoints-title">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow ?? ''"
        :title="title ?? ''"
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
            :to="item.to"
            cta="See full details"
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

@media (min-width: 1000px) {
  .leaks {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
