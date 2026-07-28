<script setup lang="ts">
/**
 * PositioningContrast — Bond band (design spec §4.5)
 *
 * Kills the "another AI tool" objection by naming the two alternatives honestly
 * before naming ours.
 *
 * DESIGN NOTE — why this is not three matching cards.
 * The first pass rendered all three options as near-identical white cards on a
 * near-white ground, which made the argument readable but not visible: nothing
 * on screen said which path the reader should take, and the winning column was
 * the LIGHTEST element in the row. Three changes fix that:
 *
 *  1. The TryEntitle column is INK. It uses the page's own ink/bond device at
 *     column scale, so the conclusion is the heaviest thing in the section
 *     instead of the faintest.
 *  2. Every column carries a verdict mark — redline crosses on the two
 *     alternatives, a seal check on ours. Redline already means "this is costing
 *     you" everywhere else on the page, so the mark needs no legend.
 *  3. The rows ALIGN. Each column is a grid with matched tracks, so "where it
 *     breaks" and "costs" sit on shared baselines across all three. Ragged
 *     footers were the main reason the section read as unfinished.
 *
 * No claim is invented to achieve this: `breaks` and `cost` restate what the
 * spec's own comparison table already says about each path.
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import type { PositioningColumn } from '@/data/positioning'

defineProps<{
  eyebrow: string
  title: string
  items: PositioningColumn[]
}>()
</script>

<template>
  <Section tone="bond" labelledby="positioning-title">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        title-id="positioning-title"
        aside="Three ways this problem usually gets handled. Only one of them ends with the work actually running."
      />

      <ul class="compare">
        <li
          v-for="col in items"
          :key="col.title"
          class="col"
          :class="{ 'col--ours on-ink': col.featured }"
          data-reveal
        >
          <p class="col__kicker">
            <span class="col__verdict" :class="col.featured ? 'is-yes' : 'is-no'" aria-hidden="true">
              <Icon :name="col.featured ? 'check' : 'close'" :size="13" />
            </span>
            <span class="mono-label">{{ col.kicker }}</span>
          </p>

          <h3 class="col__title">{{ col.title }}</h3>

          <p class="col__body">{{ col.body }}</p>

          <dl class="col__facts">
            <div class="fact">
              <dt class="mono-label">Where it breaks</dt>
              <dd>{{ col.breaks }}</dd>
            </div>
            <div class="fact">
              <dt class="mono-label">Costs</dt>
              <dd>{{ col.cost }}</dd>
            </div>
          </dl>
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
/* ─── Columns ────────────────────────────────────────────────────────── */
.compare {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .compare {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: stretch;
  }
}

/*
 * Matched row tracks are what make the three columns read as a comparison:
 * kicker / title / body / facts land on the same baselines regardless of how
 * long each column's copy is. `1fr` on the body absorbs the difference.
 */
.col {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: var(--space-3);
  padding: var(--space-6);
  background-color: var(--bond-raised);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
  transition:
    opacity var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard);
}

/* The conclusion, on ink. */
.col--ours {
  background-color: var(--ink);
  border-color: var(--ink);
  box-shadow: 0 0 0 1px var(--seal), var(--shadow-lift);
}

@media (min-width: 900px) {
  /* Raised 8px proud of the alternatives (spec §4.5). */
  .col--ours {
    margin-block: -8px;
  }

  /* The alternatives recede while the conclusion is hovered. Opacity, not
     filter: filter would repaint the whole subtree and wash out the seal edge. */
  @media (prefers-reduced-motion: no-preference) {
    .compare:has(.col--ours:hover) .col:not(.col--ours) {
      opacity: 0.5;
    }
  }
}

/* ─── Kicker + verdict ───────────────────────────────────────────────── */
.col__kicker {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-on-bond-muted);
}

.col--ours .col__kicker {
  color: var(--seal);
}

.col__verdict {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: var(--radius-pill);
}

.col__verdict.is-no {
  color: #a3352a;
  background-color: var(--redline-wash);
}

.col__verdict.is-yes {
  color: var(--ink);
  background-color: var(--seal);
}

/* ─── Copy ───────────────────────────────────────────────────────────── */
.col__title {
  font-size: var(--text-h3);
  font-weight: 600;
}

.col--ours .col__title {
  color: var(--text-on-ink);
}

.col__body {
  color: var(--text-on-bond-muted);
}

.col--ours .col__body {
  color: var(--text-on-ink-muted);
}

/* ─── Facts ledger ───────────────────────────────────────────────────── */
.col__facts {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
}

.col--ours .col__facts {
  border-top-color: rgba(200, 147, 58, 0.35);
}

.fact dt {
  color: var(--text-on-bond-muted);
  margin-bottom: var(--space-1);
}

.col--ours .fact dt {
  color: var(--seal);
}

.fact dd {
  margin: 0;
  font-size: var(--text-body);
  color: var(--text-on-bond);
}

.col--ours .fact dd {
  color: var(--text-on-ink);
  font-weight: 500;
}
</style>
