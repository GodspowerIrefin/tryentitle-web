<script setup lang="ts">
/**
 * UseCaseGrid (PRD FR14 / FR15)
 *
 * The "show me" band on every detail page. Each card states one workflow as
 * three checkable claims — what happens today, what we build instead, and what
 * changes — so a reader from the field can recognise their own week without
 * reading a paragraph of prose (the credibility gate, PRD §17).
 *
 * A set, not a sequence: no numbering (PRD §10.7). Outcomes render as plain
 * text chips, never as invented percentages or a fake metric tile (§10.2).
 *
 * Presentational: every string, including the three column labels, arrives via
 * props (PRD §11.3 rules 3 and 4).
 *
 * Accessibility: renders a list of articles, each headed by an h3 under the
 * section's h2. The label/value pairs are a description list so the label is
 * announced with its value rather than as loose text.
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import type { UseCase } from '@/data/industry-detail'

withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    intro?: string
    items: UseCase[]
    /** Label above "what happens today". */
    problemLabel: string
    /** Label above "what we build instead". */
    buildLabel: string
    /** Label above the outcome chips. */
    impactsLabel: string
    /** Surface tone for the band, so pages can keep tones alternating. */
    tone?: 'bond' | 'bond-raised'
  }>(),
  { tone: 'bond-raised' },
)
</script>

<template>
  <Section :tone="tone" labelledby="usecases-title">
    <Container>
      <!--
        `aside`, not `intro`. Both callers pass a long heading ("What this looks
        like on a real workflow." / "Where are your best people doing the most
        manual work?") plus a two-line supporting paragraph, which is the exact
        case SectionHeader documents the split layout for: in the narrow `intro`
        column the heading broke to three lines and the right half of the band sat
        empty above the cards.
      -->
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        title-id="usecases-title"
        :aside="intro"
      />

      <ul class="usecases">
        <li v-for="item in items" :key="item.title">
          <article class="usecase">
            <h3 class="usecase__title">{{ item.title }}</h3>

            <dl class="usecase__pairs">
              <dt class="usecase__label">{{ problemLabel }}</dt>
              <dd class="usecase__problem">{{ item.problem }}</dd>
              <dt class="usecase__label usecase__label--build">{{ buildLabel }}</dt>
              <dd class="usecase__build">{{ item.build }}</dd>
            </dl>

            <div class="usecase__impacts">
              <p class="usecase__label">{{ impactsLabel }}</p>
              <ul class="impacts">
                <li v-for="impact in item.impacts" :key="impact" class="impact">
                  <Icon name="check" :size="14" />
                  <span>{{ impact }}</span>
                </li>
              </ul>
            </div>
          </article>
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
.usecases {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .usecases {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.usecase {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
  padding: var(--space-5);
  background-color: var(--bond-raised);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
}

.usecase__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 400;
  letter-spacing: var(--tracking-display);
}

.usecase__pairs {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1 0 auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
}

.usecase__label {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
}

/* The deliverable reads in the brand signal colour, as on the process rail. */
.usecase__label--build {
  color: var(--text-on-bond);
  margin-top: var(--space-3);
}

.usecase__problem {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body);
}

.usecase__build {
  color: var(--text-on-bond);
  font-size: var(--text-body);
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--seal);
}

.usecase__impacts {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
}

.impacts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.impact {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background-color: var(--seal-wash);
  border: 1px solid color-mix(in srgb, var(--seal) 18%, var(--rule-on-bond));
  border-radius: var(--radius-chip);
  color: var(--text-on-bond);
  font-size: var(--text-body-sm);
}

.impact :deep(.icon) {
  flex: none;
  color: var(--text-on-bond);
}
</style>
