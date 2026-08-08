<script setup lang="ts">
/**
 * PainPoints — "What we do" / where the hours go (design spec §4.4, PRD FR8)
 *
 * Bond band carrying six marked cream cards in a responsive grid — each one
 * seal-ruled at the head rather than seal-filled, so the row reads as filed
 * paper. Presentational; items arrive via props (PRD §11.3 rule 3).
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
  <Section tone="bond" class="pain-points" labelledby="painpoints-title">
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
            surface="marked"
            stat-tone="redline"
          />
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
/* Transparent base, not `--bond` — the page gradient has to keep running under
   this band or the wash sits on a flat patch with visible edges. */
.pain-points {
  background: radial-gradient(ellipse 70% 55% at 10% 0%, var(--seal-wash), transparent 55%);
}

.leaks {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--stack-lead);
  grid-template-columns: 1fr;
  list-style: none;
  padding: 0;
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
