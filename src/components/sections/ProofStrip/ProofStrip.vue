<script setup lang="ts">
/**
 * ProofStrip (PRD FR12 / §8.4)
 *
 * Renders NOTHING when there is no proof. No skeletons, no greyed logo strips,
 * no "trusted by" placeholders, no invented quotes. When real, permissioned
 * testimonials exist, it renders them with full attribution (name, role,
 * company) — anonymous proof cannot reach this component because the loader
 * schema rejects it (see lib/proof.ts).
 *
 * Presentational; testimonials arrive via props (PRD §11.3 rule 3).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import type { Testimonial } from '@/lib/proof'

const props = defineProps<{ items: Testimonial[] }>()
// Explicit for readability and to mirror the FR12 acceptance criterion.
const hasProof = props.items.length > 0
</script>

<template>
  <Section v-if="hasProof" tone="surface" labelledby="proof-title" aria-label="What clients say">
    <Container>
      <Eyebrow id="proof-title">In their words</Eyebrow>
      <ul class="proof">
        <li v-for="(t, i) in items" :key="i" class="proof__item">
          <blockquote class="proof__quote">“{{ t.quote }}”</blockquote>
          <p class="proof__attr">
            <span class="proof__name">{{ t.name }}</span>
            <span class="proof__role">{{ t.role }}, {{ t.company }}</span>
          </p>
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
.proof {
  display: grid;
  gap: var(--space-6);
  margin-top: var(--space-6);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .proof {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.proof__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--accent-exception);
}

.proof__quote {
  font-size: var(--text-body-lg);
  color: var(--text-primary);
}

.proof__attr {
  display: flex;
  flex-direction: column;
}

.proof__name {
  font-weight: 600;
}

.proof__role {
  color: var(--text-secondary);
  font-size: var(--text-body-sm);
}
</style>
