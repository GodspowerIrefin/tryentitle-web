<script setup lang="ts">
/**
 * HoursCalculator — Bond band, conversion panel (design spec §4.10)
 *
 * Two-column layout: inputs on the left, live figures + booking CTA on the
 * right. Arithmetic is on the visitor's OWN inputs only — never a benchmark.
 *
 * Accessibility:
 * - Real <input type="range"> with <label>
 * - Live figure announced via aria-live="polite" after settle (not mid-drag)
 */
import { computed, ref, watch } from 'vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import BookingButton from '@/components/marketing/BookingButton'

defineProps<{
  eyebrow: string
  title: string
  footnote: string
}>()

const people = ref(20)
const hoursEach = ref(30)
const hourlyCost = ref(27)

const WEEKS_PER_YEAR = 48

const annualHours = computed(() => people.value * hoursEach.value * WEEKS_PER_YEAR)
const annualCost = computed(() => annualHours.value * hourlyCost.value)

function fill(value: number, min: number, max: number): string {
  return `${((value - min) / (max - min)) * 100}%`
}

const hoursLabel = computed(() => annualHours.value.toLocaleString('en-US'))
const costLabel = computed(() =>
  annualCost.value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }),
)

const prefill = computed(
  () =>
    `Estimated ${hoursLabel.value} hours and ${costLabel.value} a year on manual admin ` +
    `(${people.value} people × ${hoursEach.value} hrs/week × ${WEEKS_PER_YEAR} weeks).`,
)

const announced = ref('')
let settle: ReturnType<typeof setTimeout> | undefined
watch(
  [hoursLabel, costLabel],
  () => {
    clearTimeout(settle)
    settle = setTimeout(() => {
      announced.value = `${hoursLabel.value} hours and ${costLabel.value} a year.`
    }, 500)
  },
  { immediate: true },
)
</script>

<template>
  <Section tone="bond" labelledby="calc-title">
    <Container>
      <div class="panel">
        <div class="panel__inputs">
          <div class="panel__head">
            <Eyebrow>{{ eyebrow }}</Eyebrow>
            <Heading id="calc-title" :level="2" size="h2">{{ title }}</Heading>
          </div>

          <div class="fields">
            <div class="field">
              <label class="field__label" for="calc-people">
                People doing manual admin:
                <span class="field__value">{{ people }}</span>
              </label>
              <input
                id="calc-people"
                v-model.number="people"
                class="slider"
                type="range"
                min="1"
                max="40"
                step="1"
                :style="{ '--fill': fill(people, 1, 40) }"
              />
            </div>

            <div class="field">
              <label class="field__label" for="calc-hours">
                Hours each, per week:
                <span class="field__value">{{ hoursEach }}</span>
              </label>
              <input
                id="calc-hours"
                v-model.number="hoursEach"
                class="slider"
                type="range"
                min="1"
                max="30"
                step="1"
                :style="{ '--fill': fill(hoursEach, 1, 30) }"
              />
            </div>

            <div class="field">
              <label class="field__label" for="calc-cost">
                Average loaded hourly cost:
                <span class="field__value">${{ hourlyCost }}</span>
              </label>
              <input
                id="calc-cost"
                v-model.number="hourlyCost"
                class="slider"
                type="range"
                min="15"
                max="150"
                step="1"
                :style="{ '--fill': fill(hourlyCost, 15, 150) }"
              />
            </div>
          </div>
        </div>

        <div class="panel__result" data-reveal>
          <div class="stat stat--hours">
            <p class="stat__label">Hours lost per year</p>
            <p class="stat__value">{{ hoursLabel }} hours</p>
          </div>

          <div class="stat stat--cost">
            <p class="stat__label">Before errors and delays</p>
            <p class="stat__value">{{ costLabel }}</p>
          </div>

          <p class="visually-hidden" aria-live="polite">{{ announced }}</p>

          <p class="panel__footnote">{{ footnote }}</p>

          <div class="panel__action">
            <BookingButton placement="calculator" size="lg" :prefill="prefill" />
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.panel {
  display: grid;
  gap: var(--space-8);
  align-items: start;
  padding: var(--space-6);
  background-color: var(--verify-wash);
  border: 1px solid color-mix(in srgb, var(--verify) 18%, var(--rule-on-bond));
  border-radius: var(--radius-card);
}

@media (min-width: 640px) {
  .panel {
    padding: var(--space-8);
  }
}

@media (min-width: 900px) {
  .panel {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: var(--space-9);
    align-items: center;
    padding: var(--space-8) var(--space-9);
  }
}

.panel__inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
}

.panel__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 18ch;
}

@media (min-width: 640px) {
  .panel__head {
    max-width: 22ch;
  }
}

.fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.field__label {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--text-on-bond);
}

.field__value {
  font-variant-numeric: tabular-nums;
}

.slider {
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: var(--radius-pill);
  background: linear-gradient(
    to right,
    var(--verify) 0%,
    var(--verify) var(--fill, 50%),
    var(--ink) var(--fill, 50%)
  );
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  background-color: var(--verify);
  border: 3px solid var(--bond-raised);
  box-shadow: var(--shadow-card);
  cursor: grab;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  background-color: var(--verify);
  border: 3px solid var(--bond-raised);
  box-shadow: var(--shadow-card);
  cursor: grab;
}

.slider:focus-visible {
  outline: 2px solid var(--verify);
  outline-offset: 4px;
}

.panel__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-card);
}

.stat--hours {
  background-color: var(--bond-raised);
  border: 1px solid var(--rule-on-bond);
  box-shadow: var(--shadow-card);
}

.stat--cost {
  background-color: var(--ink);
  color: var(--text-on-ink);
}

.stat__label {
  font-family: var(--font-body);
  font-size: var(--text-body-sm);
  color: var(--text-on-bond-muted);
}

.stat--cost .stat__label {
  color: var(--text-on-ink-muted);
}

.stat__value {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: var(--tracking-display);
  font-variation-settings: 'wdth' 95;
  font-variant-numeric: tabular-nums;
  color: var(--text-on-bond);
}

.stat--cost .stat__value {
  color: var(--verify);
}

.panel__footnote {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-sm);
  max-width: 42ch;
  line-height: var(--leading-body);
}

.panel__action {
  margin-top: var(--space-2);
}

.panel__action :deep(.btn) {
  width: 100%;
}
</style>
