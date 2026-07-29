<script setup lang="ts">
/**
 * OversightLayer — Ink band (design spec §4.8)
 *
 * The differentiator, stated as a capacity bar: the repeatable majority in
 * verify green, the judgment remainder in seal gold labelled HUMAN REVIEW.
 * This deliberately mirrors the hero's gold node — the same visual argument,
 * deepened, so the idea is seen twice before the ask.
 *
 * The gold segment is expandable to reveal real exception examples. It is a real
 * <button> with `aria-expanded`, not a hover-only affordance: the spec sketches
 * hover-reveal (§4.8), but hover alone is unreachable by keyboard and unusable
 * on touch, so the disclosure is click/enter-driven and hover is an enhancement.
 *
 * PROPORTION NOTE: the spec writes "around 90%". That figure is presented here as
 * a qualitative split rather than a measured claim, because TryEntitle has no
 * engagement data to support a percentage yet, and a precise number on this bar
 * reads as a finding. The bar is still weighted to show the shape of the split.
 */
import { ref } from 'vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Icon from '@/components/primitives/Icon'

const props = defineProps<{
  eyebrow: string
  title: string
  body: string
  automatedLabel: string
  humanLabel: string
  /** Concrete exception examples revealed from the gold segment. */
  examples?: readonly string[]
}>()

const open = ref(false)
const hasExamples = () => Boolean(props.examples?.length)
</script>

<template>
  <Section tone="ink" labelledby="oversight-title">
    <Container>
      <div class="oversight">
        <div class="oversight__copy">
          <Eyebrow>{{ eyebrow }}</Eyebrow>
          <Heading id="oversight-title" :level="2" size="h2">{{ title }}</Heading>
          <p class="oversight__body">{{ body }}</p>
        </div>

        <div class="oversight__panel" data-reveal>
          <!-- The capacity bar. Decorative: the split is stated in the copy and
               in the two labels below, so the bar itself carries no information
               a screen reader would miss. -->
          <div class="bar" aria-hidden="true">
            <div class="bar__auto" />
            <div class="bar__human" />
          </div>

          <div class="bar__legend">
            <p class="legend__item">
              <span class="legend__swatch legend__swatch--auto" aria-hidden="true" />
              <span class="mono-label">{{ automatedLabel }}</span>
              <span class="legend__note">the repeatable majority</span>
            </p>

            <component
              :is="hasExamples() ? 'button' : 'p'"
              class="legend__item legend__item--human"
              :type="hasExamples() ? 'button' : undefined"
              :aria-expanded="hasExamples() ? open : undefined"
              @click="hasExamples() && (open = !open)"
            >
              <span class="legend__swatch legend__swatch--human" aria-hidden="true" />
              <span class="mono-label">{{ humanLabel }}</span>
              <span class="legend__note">the judgment calls</span>
              <Icon
                v-if="hasExamples()"
                :name="open ? 'minus' : 'plus'"
                :size="14"
                class="legend__toggle"
              />
            </component>
          </div>

          <ul v-if="hasExamples() && open" class="examples">
            <li v-for="example in examples" :key="example">
              <Icon name="users" :size="16" />
              <span>{{ example }}</span>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.oversight {
  display: grid;
  gap: var(--space-8);
}

@media (min-width: 960px) {
  .oversight {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-9);
    align-items: center;
  }
}

.oversight__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
}

.oversight__body {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-lg);
  max-width: var(--measure);
}

.oversight__panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* ─── Capacity bar ───────────────────────────────────────────────────── */
.bar {
  display: flex;
  height: 56px;
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--rule-on-ink);
}

.bar__auto {
  flex: 0 0 82%;
  background: repeating-linear-gradient(
    -45deg,
    rgba(47, 169, 140, 0.9) 0 10px,
    rgba(47, 169, 140, 0.72) 10px 20px
  );
}

.bar__human {
  flex: 1 0 auto;
  background-color: var(--seal);
}

@media (prefers-reduced-motion: no-preference) {
  .bar__auto {
    /* Fills once when the band is reached. `transform` on an inline-size axis
       keeps this off the layout thread. */
    transform-origin: left center;
    animation: fill var(--duration-slow) var(--ease-standard) both;
  }
}

@keyframes fill {
  from {
    transform: scaleX(0.2);
  }
  to {
    transform: scaleX(1);
  }
}

/* ─── Legend ─────────────────────────────────────────────────────────── */
.bar__legend {
  display: grid;
  gap: var(--space-3);
}

@media (min-width: 560px) {
  .bar__legend {
    grid-template-columns: 1fr 1fr;
  }
}

.legend__item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  text-align: start;
  color: var(--text-on-ink);
  padding: var(--space-3);
  border: 1px solid var(--rule-on-ink);
  border-radius: var(--radius-card);
  background: none;
}

.legend__item--human {
  border-color: rgba(200, 147, 58, 0.4);
}

.legend__swatch {
  width: 12px;
  height: 12px;
  flex: none;
  border-radius: 2px;
}

.legend__swatch--auto {
  background-color: var(--verify);
}

.legend__swatch--human {
  background-color: var(--seal);
}

.legend__note {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-sm, 0.875rem);
  flex-basis: 100%;
}

.legend__toggle {
  margin-inline-start: auto;
  color: var(--seal);
}

/* ─── Exception examples ─────────────────────────────────────────────── */
.examples {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid rgba(200, 147, 58, 0.3);
  border-radius: var(--radius-card);
  background-color: rgba(200, 147, 58, 0.07);
}

.examples li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  color: var(--text-on-ink);
  font-size: var(--text-body);
}

.examples :deep(.icon) {
  flex: none;
  margin-top: 3px;
  color: var(--seal);
}

/* ─── Claims row ─────────────────────────────────────────────────────── */
.oversight__claims {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-ink);
}

.oversight__claims li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-on-ink-muted);
}

.oversight__claims li::before {
  content: '';
  width: 5px;
  height: 5px;
  flex: none;
  border-radius: var(--radius-pill);
  background-color: var(--verify);
}
</style>
