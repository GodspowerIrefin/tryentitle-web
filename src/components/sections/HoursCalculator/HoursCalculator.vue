<script setup lang="ts">
/**
 * HoursCalculator — Ink band (design spec §4.10)
 *
 * The conversion engine. Three inputs, a live figure, and the booking CTA
 * directly beneath with the computed number passed into the scheduler prefill.
 * Everything above this section exists to get someone here holding a number they
 * did not want to see.
 *
 * HONESTY: the output is arithmetic on the visitor's OWN inputs, never a
 * benchmark or an implied result. The footnote says so explicitly, and there is
 * no savings claim attached — the spec's "we target 60–80% of that" line is
 * omitted because TryEntitle has no engagement data to support a range yet.
 *
 * Accessibility contract:
 * - Real <input type="range"> elements with <label>, so they are keyboard
 *   operable and announced with their current value by default.
 * - The live figure is an `aria-live="polite"` region, announced on settle
 *   rather than on every keystroke of a drag.
 * - The count-up is decorative: the region's text is always the true value, so
 *   assistive tech never reads an intermediate number.
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

const people = ref(4)
const hoursEach = ref(6)
const hourlyCost = ref(38)

const WEEKS_PER_YEAR = 48

const annualHours = computed(() => people.value * hoursEach.value * WEEKS_PER_YEAR)
const annualCost = computed(() => annualHours.value * hourlyCost.value)

/**
 * Percentage of each slider that should read as filled. Range inputs give no
 * way to style the portion left of the thumb cross-engine, so the track is a
 * gradient and this drives its stop.
 */
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

/**
 * Note handed to the scheduler so the call opens with the visitor's own figure
 * already on the table.
 */
const prefill = computed(
  () =>
    `Estimated ${hoursLabel.value} hours and ${costLabel.value} a year on manual admin ` +
    `(${people.value} people × ${hoursEach.value} hrs/week × ${WEEKS_PER_YEAR} weeks).`,
)

/**
 * Debounced mirror of the figure for the live region: announcing on every input
 * event during a slider drag would flood a screen reader.
 */
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
  <Section tone="ink" labelledby="calc-title">
    <Container>
      <div class="calc">
        <div class="calc__head">
          <Eyebrow>{{ eyebrow }}</Eyebrow>
          <Heading id="calc-title" :level="2" size="h2">{{ title }}</Heading>
        </div>

        <div class="calc__grid">
          <div class="calc__inputs">
            <div class="field">
              <label class="field__label mono-label" for="calc-people">
                People doing manual admin
              </label>
              <div class="field__row">
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
                <output class="field__value" for="calc-people">{{ people }}</output>
              </div>
            </div>

            <div class="field">
              <label class="field__label mono-label" for="calc-hours">
                Hours each, per week
              </label>
              <div class="field__row">
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
                <output class="field__value" for="calc-hours">{{ hoursEach }}</output>
              </div>
            </div>

            <div class="field">
              <label class="field__label mono-label" for="calc-cost">
                Average loaded hourly cost
              </label>
              <div class="field__row">
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
                <output class="field__value" for="calc-cost">${{ hourlyCost }}</output>
              </div>
            </div>
          </div>

          <div class="calc__result" data-reveal>
            <p class="result__figures">
              <span class="result__number">{{ hoursLabel }}</span>
              <span class="result__unit mono-label">hours a year</span>
            </p>
            <p class="result__figures result__figures--cost">
              <span class="result__number">{{ costLabel }}</span>
              <span class="result__unit mono-label">before errors and delays</span>
            </p>

            <p class="visually-hidden" aria-live="polite">{{ announced }}</p>

            <div class="result__action">
              <BookingButton placement="calculator" size="lg" :prefill="prefill" />
            </div>

            <p class="result__footnote">{{ footnote }}</p>
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.calc {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.calc__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
  max-width: 40ch;
}

.calc__grid {
  display: grid;
  gap: var(--space-6);
}

@media (min-width: 900px) {
  .calc__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-8);
    align-items: start;
  }
}

/* ─── Inputs ─────────────────────────────────────────────────────────── */
.calc__inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field__label {
  color: var(--text-on-ink-muted);
}

.field__row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.field__value {
  font-family: var(--font-mono);
  font-size: var(--text-body-lg);
  color: var(--seal);
  min-width: 3.5ch;
  text-align: end;
}

/* Seal-track slider. Styled per-engine because range inputs have no common
   pseudo-element; both branches use the same tokens. */
.slider {
  flex: 1 1 auto;
  appearance: none;
  height: 4px;
  border-radius: var(--radius-pill);
  background: linear-gradient(
    to right,
    var(--seal) 0%,
    var(--seal) var(--fill, 50%),
    rgba(242, 243, 240, 0.16) var(--fill, 50%)
  );
  background-color: rgba(242, 243, 240, 0.16);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
  border: 2px solid var(--ink);
  cursor: grab;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
  border: 2px solid var(--ink);
  cursor: grab;
}

/* ─── Result ─────────────────────────────────────────────────────────── */
.calc__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background-color: var(--ink-raised);
  border: 1px solid var(--rule-on-ink);
  border-radius: var(--radius-card);
}

.result__figures {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.result__figures--cost {
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-ink);
}

.result__number {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  line-height: 1;
  letter-spacing: var(--tracking-display);
  font-variation-settings: 'wdth' 95;
  color: var(--text-on-ink);
  /* Tabular figures stop the number jittering as digits change during a drag. */
  font-variant-numeric: tabular-nums;
}

.result__unit {
  color: var(--text-on-ink-muted);
}

.result__action {
  margin-top: var(--space-2);
}

.result__footnote {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body);
}
</style>
