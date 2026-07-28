<script setup lang="ts">
/**
 * IndustriesGrid — Bond band (design spec §4.9, PRD FR10)
 *
 * Self-identification. Seven industries, each naming the workflow you would fix
 * first in that field's own artifacts — generic industry copy actively damages
 * credibility with an ops lead who works in that field daily (PRD §17 risk).
 *
 * DESIGN NOTE — why this is a dense list and not a filtered card grid.
 * The first pass ran 1582px, the tallest section on the page, and spent that
 * height saying the same thing twice:
 *
 *  1. A row of EIGHT filter chips named all seven industries, and the grid below
 *     then named them again. With only seven always-visible items the filter had
 *     almost no work to do — narrowing to one industry revealed a card the reader
 *     could already see — so it cost a full row and a live region to save nobody
 *     anything. Removed.
 *  2. Seven cards in a three-column grid left an ORPHAN final row: one card, two
 *     empty cells. Two columns take seven rows to 4 + 3, and the eighth cell
 *     carries the "not on the list?" invitation — so the ragged corner becomes
 *     the place the FR10 note lives, instead of a separate block below it.
 *  3. "See the workflows →" repeated seven times when the whole row is already a
 *     link. One arrow per row now, which is also less to read.
 *
 * Result is roughly half the height with nothing removed but duplication.
 *
 * Accessibility: each row is a single link wrapping icon, name, and workflow
 * line, so there is one tab stop per industry and the accessible name is the
 * whole row rather than seven identical "see the workflows" links.
 */
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
          'Seven fields we know the paperwork of. Each one names the workflow we would fix first.'
        "
        :level="level"
      />

      <ul class="fields">
        <li v-for="industry in items" :key="industry.slug" data-reveal>
          <RouterLink :to="`/industries/${industry.slug}`" class="field">
            <span class="field__icon" aria-hidden="true">
              <Icon :name="industry.icon" :size="18" />
            </span>
            <span class="field__text">
              <span class="field__name">{{ industry.name }}</span>
              <span class="field__blurb">{{ industry.blurb }}</span>
            </span>
            <Icon name="arrow-up-right" :size="16" class="field__arrow" />
          </RouterLink>
        </li>

        <!-- The eighth cell. FR10 requires the "not exhaustive" note, and the
             two-column grid leaves exactly one slot for it — so the note lands
             inside the set it is qualifying rather than trailing beneath it. -->
        <li class="invite" data-reveal>
          <p class="invite__text">{{ note }}</p>
          <BookingButton
            v-if="noteCta"
            placement="industries-note"
            variant="secondary"
            :label="noteCta"
          />
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
.fields {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

/*
 * REQUIRED. Grid items default to `min-width: auto`, which stops a track
 * shrinking below its content's min-content width. Without this the single
 * column at 360px resolved to 350px inside a 328px container and pushed the
 * whole page into horizontal scroll (NFR1) — the row was wider than its own
 * parent. `min-width: 0` lets the track take the container's width and the copy
 * wrap inside it.
 */
.fields > li {
  min-width: 0;
}

@media (min-width: 820px) {
  .fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--space-4);
  }
}

/* ─── Row ────────────────────────────────────────────────────────────── */
.field {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--space-4);
  height: 100%;
  padding: var(--space-4) var(--space-5);
  background-color: var(--bond-raised);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
  color: inherit;
  text-decoration: none;
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.field:hover {
  border-color: var(--rule-hover);
  box-shadow: var(--shadow-card);
}

.field__icon {
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

.field__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.field__name {
  font-weight: 600;
  font-size: var(--text-body-lg);
  line-height: 1.3;
}

.field__blurb {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body);
}

.field__arrow {
  flex: none;
  margin-top: var(--space-1);
  color: var(--text-on-bond-muted);
  transition:
    transform var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

@media (prefers-reduced-motion: no-preference) {
  .field:hover .field__arrow {
    transform: translate(2px, -2px);
    color: var(--seal-ink);
  }
}

/* ─── The invitation cell ────────────────────────────────────────────── */
.invite {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px dashed var(--border-strong, var(--rule-on-bond));
  border-radius: var(--radius-card);
  /* Dashed and unfilled so it reads as an open slot in the set — the one place
     a reader who does not see themselves is invited in. */
  background-color: transparent;
}

.invite__text {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body);
}
</style>
