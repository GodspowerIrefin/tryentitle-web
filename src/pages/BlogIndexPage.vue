<script setup lang="ts">
/**
 * Insights index (/blog).
 *
 * Card grid of TryEntitle notes and curated external reading. Click opens an
 * in-page reader — no fake posts, no empty-state stall while content exists.
 */
import { useHead } from '@unhead/vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import InsightsGrid from '@/components/sections/InsightsGrid'
import { insightsNewestFirst } from '@/data/insights'
import { buildHead } from '@/lib/metadata'

useHead(
  buildHead({
    title: 'Insights',
    description:
      'Notes on operations, document workflows, and where automation helps — plus curated external reading.',
    path: '/blog',
    image: '/og/blog.png',
  }),
)
</script>

<template>
  <Section labelledby="insights-title" class="insights">
    <Container>
      <div class="insights__intro">
        <Eyebrow>Insights</Eyebrow>
        <Heading id="insights-title" :level="1" size="h2">
          Notes on how work actually moves.
        </Heading>
        <p class="insights__lead">
          TryEntitle field notes mixed with external reading worth your time. Open a card to read —
          external pieces link out to the publisher.
        </p>
      </div>

      <div class="insights__list">
        <InsightsGrid :insights="insightsNewestFirst" />
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.insights {
  position: relative;
  overflow: clip;
}

.insights::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: min(28rem, 55vh);
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 80% at 12% 0%, var(--seal-wash), transparent 60%),
    radial-gradient(ellipse 55% 70% at 88% 10%, var(--verify-wash), transparent 55%);
}

.insights__intro {
  position: relative;
  max-width: 40rem;
}

.insights__lead {
  margin-top: var(--space-4);
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-lg);
}

.insights__list {
  position: relative;
  margin-top: var(--space-8);
}
</style>
