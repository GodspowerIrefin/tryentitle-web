<script setup lang="ts">
/**
 * IndustriesGrid — Bond band (design spec §4.9, PRD FR10)
 *
 * Accordion of industries. Each row opens to a numbered workflow index — a
 * vertical rail of plain labels, not chips — plus a link to the industry detail
 * page. Ends with the required "not on the list?" invitation (FR10).
 *
 * Accessibility: each industry is a real <button> inside an <h3> with
 * `aria-expanded` / `aria-controls`; the panel is `role="region"`. The detail
 * link is a separate focusable control inside the open panel.
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import BookingButton from '@/components/marketing/BookingButton'
import SectionHeader from '@/components/sections/SectionHeader'
import type { IndustrySummary } from '@/data/industries'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
  note: string
  noteCta?: string
  items: IndustrySummary[]
  level?: 1 | 2 | 3
}>()

/** Index of the open panel; null means all closed. */
const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

function marker(i: number): string {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <Section tone="bond" labelledby="industries-title">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        title-id="industries-title"
        :aside="
          intro ??
          'Seven fields we know the paperwork of. Open one to see the workflows — then go deeper for the full picture.'
        "
        :level="level"
      />

      <ul class="industries">
        <li v-for="(industry, i) in items" :key="industry.slug" class="industry" data-reveal>
          <h3 class="industry__heading">
            <button
              :id="`industry-q-${industry.slug}`"
              type="button"
              class="industry__trigger"
              :aria-expanded="openIndex === i"
              :aria-controls="`industry-a-${industry.slug}`"
              @click="toggle(i)"
            >
              <span class="industry__icon" aria-hidden="true">
                <Icon :name="industry.icon" :size="18" />
              </span>
              <span class="industry__name">{{ industry.name }}</span>
              <Icon
                :name="openIndex === i ? 'minus' : 'plus'"
                :size="18"
                class="industry__marker"
                aria-hidden="true"
              />
            </button>
          </h3>

          <div
            :id="`industry-a-${industry.slug}`"
            class="industry__panel"
            :class="{ 'is-open': openIndex === i }"
            role="region"
            :aria-labelledby="`industry-q-${industry.slug}`"
            :inert="openIndex !== i"
          >
            <div class="industry__panel-inner">
              <ol class="workflows">
                <li v-for="(workflow, wi) in industry.workflows" :key="workflow" class="workflow">
                  <span class="workflow__index" aria-hidden="true">{{ marker(wi) }}</span>
                  <span class="workflow__label">{{ workflow }}</span>
                </li>
              </ol>

              <RouterLink :to="`/industries/${industry.slug}`" class="industry__more">
                More about {{ industry.name }}
                <Icon name="arrow-right" :size="16" />
              </RouterLink>
            </div>
          </div>
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
.industries {
  display: flex;
  flex-direction: column;
  margin-top: var(--space-8);
  border-top: 1px solid var(--rule-on-bond);
}

.industry {
  border-bottom: 1px solid var(--rule-on-bond);
  min-width: 0;
}

.industry__heading {
  margin: 0;
  font: inherit;
  letter-spacing: normal;
}

.industry__trigger {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  padding-block: var(--space-4);
  text-align: start;
  color: var(--text-on-bond);
}

.industry__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: var(--radius-chip);
  background-color: var(--ink);
  color: var(--seal);
}

.industry__name {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  font-weight: 600;
  line-height: 1.3;
}

.industry__marker {
  flex: none;
  color: var(--seal-ink);
}

.industry__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-slow) var(--ease-standard);
}

.industry__panel.is-open {
  grid-template-rows: 1fr;
}

.industry__panel-inner {
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  padding-inline-start: calc(34px + var(--space-4));
  padding-bottom: 0;
  transition: padding-bottom var(--duration-slow) var(--ease-standard);
}

.industry__panel.is-open .industry__panel-inner {
  padding-bottom: var(--space-6);
}

@media (prefers-reduced-motion: reduce) {
  .industry__panel,
  .industry__panel-inner {
    transition: none;
  }
}

/* Numbered workflow index — a process rail, not a chip cluster. */
.workflows {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 36rem;
}

.workflow {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: var(--space-4);
  align-items: baseline;
  padding-block: var(--space-3);
  border-bottom: 1px solid var(--rule-on-bond);
}

.workflow:last-child {
  border-bottom: none;
}

.workflow__index {
  position: relative;
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  color: var(--text-on-bond-muted);
}

/* Hairline rail down the marker column, connecting the steps. */
.workflow__index::before {
  content: '';
  position: absolute;
  left: 0.7rem;
  top: 1.35rem;
  bottom: calc(-1 * var(--space-3) - 1px);
  width: 1px;
  background-color: var(--rule-on-bond);
}

.workflow:last-child .workflow__index::before {
  display: none;
}

.workflow__label {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--text-on-bond);
  line-height: 1.45;
}

.industry__more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  font-weight: 500;
  color: var(--seal-ink);
  text-decoration: none;
}

.industry__more:hover {
  color: var(--text-on-bond);
}

.invite {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  margin-top: var(--space-7);
  padding-top: var(--space-6);
  border-top: 1px solid var(--rule-on-bond);
}

.invite__label {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  font-weight: 500;
  color: var(--seal-ink);
}

.invite__text {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body);
  max-width: 48ch;
}
</style>
