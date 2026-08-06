<script setup lang="ts">
/**
 * HoursCalculator — Bond band, conversion panel (design spec §4.10)
 *
 * Consulting-landing layout: a large paper panel with inputs on the left and
 * live figures + booking CTA on the right. Arithmetic uses the visitor's OWN
 * inputs only — never a benchmark.
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
  <Section tone="bond" class="calc" labelledby="calc-title">
    <Container>
      <div class="shell">
        <header class="shell__head">
          <Eyebrow>{{ eyebrow }}</Eyebrow>
          <Heading id="calc-title" :level="2" size="h2" class="shell__title">{{ title }}</Heading>
        </header>

        <div class="shell__grid">
          <div class="controls">
            <div class="field">
              <div class="field__row">
                <label class="field__label" for="calc-people">People doing manual admin</label>
                <span class="field__value" aria-hidden="true">{{ people }}</span>
              </div>
              <input
                id="calc-people"
                v-model.number="people"
                class="slider"
                type="range"
                min="1"
                max="40"
                step="1"
                :aria-valuetext="`${people} people`"
                :style="{ '--fill': fill(people, 1, 40) }"
              />
            </div>

            <div class="field">
              <div class="field__row">
                <label class="field__label" for="calc-hours">Hours each, per week</label>
                <span class="field__value" aria-hidden="true">{{ hoursEach }}</span>
              </div>
              <input
                id="calc-hours"
                v-model.number="hoursEach"
                class="slider"
                type="range"
                min="1"
                max="30"
                step="1"
                :aria-valuetext="`${hoursEach} hours`"
                :style="{ '--fill': fill(hoursEach, 1, 30) }"
              />
            </div>

            <div class="field">
              <div class="field__row">
                <label class="field__label" for="calc-cost">Average loaded hourly cost</label>
                <span class="field__value" aria-hidden="true">${{ hourlyCost }}</span>
              </div>
              <input
                id="calc-cost"
                v-model.number="hourlyCost"
                class="slider"
                type="range"
                min="15"
                max="150"
                step="1"
                :aria-valuetext="`${hourlyCost} dollars`"
                :style="{ '--fill': fill(hourlyCost, 15, 150) }"
              />
            </div>
          </div>

          <aside class="result" data-reveal aria-label="Estimated annual cost">
            <div class="result__card">
              <p class="result__stat">
                <span class="result__figure">{{ hoursLabel }}</span>
                <span class="result__caption">hours lost per year</span>
              </p>

              <p class="result__stat result__stat--accent">
                <span class="result__figure">{{ costLabel }}</span>
                <span class="result__caption">before errors and delays</span>
              </p>

              <p class="visually-hidden" aria-live="polite">{{ announced }}</p>

              <p class="result__note">{{ footnote }}</p>

              <div class="result__action">
                <BookingButton placement="calculator" size="lg" :prefill="prefill" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.calc {
  /* Soft atmosphere behind the paper shell — consulting-landing air, not a tinted box. */
  background:
    radial-gradient(ellipse 80% 70% at 12% 0%, var(--seal-wash), transparent 55%),
    radial-gradient(ellipse 60% 50% at 100% 80%, color-mix(in srgb, var(--seal) 8%, transparent), transparent 50%),
    var(--bond);
}

.shell {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: clamp(1.5rem, 3vw, 3rem);
  background-color: var(--bond-raised);
  border: 1px solid color-mix(in srgb, var(--rule-on-bond) 80%, transparent);
  border-radius: 1.5rem;
  box-shadow: 0 24px 60px rgba(15, 31, 26, 0.08);
}

.shell__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 28ch;
}

.shell__title {
  color: var(--text-on-bond);
}

.shell__grid {
  display: grid;
  gap: var(--space-8);
  align-items: stretch;
}

@media (min-width: 900px) {
  .shell {
    gap: var(--space-9);
    padding: var(--space-9);
  }

  .shell__grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: var(--space-9);
    align-items: center;
  }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--rule-on-bond);
}

.field:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.field__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
}

.field__label {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--text-on-bond);
}

.field__value {
  flex: none;
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: var(--tracking-display);
  font-variant-numeric: tabular-nums;
  color: var(--seal-ink);
}

.slider {
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: var(--radius-pill);
  background: linear-gradient(
    to right,
    var(--seal) 0%,
    var(--seal) var(--fill, 50%),
    color-mix(in srgb, var(--ink) 12%, var(--bond)) var(--fill, 50%)
  );
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
  border: 3px solid var(--bond-raised);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--seal) 35%, transparent);
  cursor: grab;
}

.slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
  border: 3px solid var(--bond-raised);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--seal) 35%, transparent);
  cursor: grab;
}

.slider:focus-visible {
  outline: 2px solid var(--seal);
  outline-offset: 4px;
}

.result__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  height: 100%;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  background-color: var(--ink);
  color: var(--text-on-ink);
  border-radius: 1.25rem;
}

.result__stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--rule-on-ink);
}

.result__stat:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.result__figure {
  font-family: var(--font-display);
  font-size: clamp(2rem, 1.6rem + 1.6vw, 2.75rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: var(--tracking-display);
  font-variation-settings: 'wdth' 95;
  font-variant-numeric: tabular-nums;
  color: var(--text-on-ink);
}

.result__stat--accent .result__figure {
  color: var(--seal);
}

.result__caption {
  font-size: var(--text-body);
  color: var(--text-on-ink-muted);
}

.result__note {
  margin-top: auto;
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-sm);
  max-width: 36ch;
  line-height: var(--leading-body);
}

.result__action {
  margin-top: var(--space-2);
}

.result__action :deep(.btn) {
  width: 100%;
}
</style>
