<script setup lang="ts">
/**
 * ProcessRail (PRD FR11 / US3)
 *
 * The engagement as an ordered sequence — a vertical timeline of numbered nodes
 * on a connecting rail, each step a card. Numbering appears here and only here
 * on the home page, because the process genuinely is a sequence and order
 * carries information (PRD §10.7).
 *
 * Each card names what the client provides and what TryEntitle delivers (the
 * deliverable highlighted in the brand signal colour), and — where relevant —
 * where a human stays in the loop, marked with the brass exception accent.
 * Presentational; steps arrive via props (PRD §11.3 rule 3).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import type { ProcessStep } from '@/data/process-steps'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
  steps: ProcessStep[]
}>()

function marker(i: number): string {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <Section labelledby="process-title">
    <Container>
      <SectionHeader :eyebrow="eyebrow" :title="title" title-id="process-title" :intro="intro" />

      <ol class="process">
        <li v-for="(step, i) in steps" :key="step.title" class="step">
          <span class="step__node" aria-hidden="true">{{ marker(i) }}</span>

          <article class="step__card">
            <h3 class="step__title">{{ step.title }}</h3>

            <div class="step__io">
              <div class="step__pair">
                <p class="step__label">
                  <Icon name="arrow-right" :size="15" />
                  <span>You provide</span>
                </p>
                <p class="step__value">{{ step.clientInput }}</p>
              </div>
              <div class="step__pair step__pair--get">
                <p class="step__label">
                  <Icon name="check" :size="15" />
                  <span>You get</span>
                </p>
                <p class="step__value">{{ step.output }}</p>
              </div>
            </div>

            <p v-if="step.human" class="step__human">
              <Icon name="users" :size="18" />
              <span>{{ step.human }}</span>
            </p>
          </article>
        </li>
      </ol>
    </Container>
  </Section>
</template>

<style scoped>
.process {
  margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  max-width: 60rem;
}

.step {
  position: relative;
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  column-gap: var(--space-5);
  padding-bottom: var(--space-6);
}

/* The rail: a hairline linking each numbered node down to the next. */
.step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: calc(1.5rem - 1px);
  top: 3rem;
  bottom: 0;
  width: 2px;
  background-color: var(--border-subtle);
}

/* Numbered node — a solid signal chip so the sequence reads at a glance. */
.step__node {
  position: relative;
  z-index: 1;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--action-primary);
  color: var(--text-inverse);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.125rem;
  border-radius: var(--radius-sm);
}

.step__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-5);
}

.step__title {
  font-family: var(--font-display);
  font-size: var(--text-heading-md);
  font-weight: 600;
  letter-spacing: var(--tracking-display);
}

.step__io {
  display: grid;
  gap: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}

@media (min-width: 680px) {
  .step__io {
    grid-template-columns: 1fr 1fr;
  }

  /* Divider between the two columns. */
  .step__pair--get {
    padding-inline-start: var(--space-5);
    border-inline-start: 1px solid var(--border-subtle);
  }
}

.step__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: var(--space-2);
}

/* Highlight the deliverable — what the client receives — in the brand colour. */
.step__pair--get .step__label {
  color: var(--action-primary);
}

.step__value {
  color: var(--text-primary);
  font-size: var(--text-body);
}

/* Human-in-the-loop note — the brass exception accent (PRD §10.3). */
.step__human {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background-color: var(--accent-exception-bg);
  border-inline-start: 2px solid var(--accent-exception);
  border-radius: var(--radius-sm);
  color: var(--accent-exception-text);
  font-size: var(--text-body-sm);
}

.step__human :deep(.icon) {
  flex: none;
  margin-top: 1px;
}
</style>
