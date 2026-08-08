<script setup lang="ts">
/**
 * ProcessRail — "How an engagement runs", Bond band (spec §4.7, PRD FR11 / US3)
 *
 * A four-step track. Numbering is legitimate here because this is a real
 * sequence and order carries information — it appears here and only here on the
 * home page.
 *
 * DESIGN NOTE — why the steps are cards now.
 * The first pass set the four steps as bare text columns floating on the band,
 * with a hairline rail above them. Against a page where every other block is a
 * panel, that read as an unstyled list rather than designed content, and three
 * things were working against the section's actual job of de-risking a
 * commitment:
 *
 *  1. TIMING was the smallest, greyest text in each column — yet "how long until
 *     something happens" is the single most reassuring fact here. It is now a
 *     seal chip at the head of each card.
 *  2. WHAT YOU WALK AWAY WITH was not stated at all. Each step now names its
 *     output, so the reader can see value accruing before they have committed.
 *  3. The strongest line on the page — "walk away here and you keep the map" —
 *     was buried mid-paragraph in step 2. It is now a pulled-out guarantee.
 *
 * Horizontal on desktop, vertical on mobile: a four-across track at 360px would
 * either clip or shrink the copy to nothing. The connector follows the axis in
 * both cases.
 *
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
  <Section tone="bond" labelledby="process-title">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        title-id="process-title"
        :aside="
          intro ??
          'Four steps from the first call to a workflow that runs. You see the scope and the price before anything gets built.'
        "
      />

      <ol class="track">
        <!--
          `data-reveal` brings the card in; `data-scrub` additionally publishes
          this card's arrival as `--enter`, which the connector below keys off so
          the rail draws itself between the steps as you scroll rather than being
          there all at once. The two systems are independent and compose: reveal
          fires once on a threshold, scrub tracks continuously.
        -->
        <li v-for="(step, i) in steps" :key="step.title" class="step" data-reveal data-scrub>
          <div class="step__head">
            <span class="step__node mono-label" aria-hidden="true">{{ marker(i) }}</span>
            <span class="step__timing mono-label">{{ step.timing }}</span>
          </div>

          <h3 class="step__title">{{ step.title }}</h3>
          <p class="step__detail">{{ step.detail }}</p>

          <p v-if="step.note" class="step__note">
            <Icon name="check" :size="15" />
            <span>{{ step.note }}</span>
          </p>
          <!-- Holds the note's grid track open on the cards that have no note.
               Without it those cards have four children for five tracks, so
               their "You get" row lands one track early and the ledger baseline
               breaks across the row. -->
          <span v-else class="step__note-slot" aria-hidden="true" />

          <p class="step__output">
            <span class="mono-label">You get</span>
            <span>{{ step.output }}</span>
          </p>
        </li>
      </ol>
    </Container>
  </Section>
</template>

<style scoped>
/* ─── Track ──────────────────────────────────────────────────────────── */
.track {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--stack-lead);
  grid-template-columns: 1fr;
}

/* Stacked on mobile: nothing to align against, so a plain column. */
.step {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--cream);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
}

.step__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.step__node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  flex: none;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
  /* Ink on ochre is 8.6:1; ochre as text would not clear AA on either ground. */
  color: var(--ink);
}

/* Timing promoted from grey afterthought to the card's headline fact. */
.step__timing {
  color: var(--seal-ink);
  background-color: var(--seal-wash);
  border-radius: var(--radius-chip);
  padding: var(--space-1) var(--space-3);
}

.step__title {
  font-size: var(--text-h3);
  font-weight: 600;
}

.step__detail {
  color: var(--text-on-bond-muted);
}

/* The pulled-out guarantee. Seal-marked because it is the risk reversal, and
   this is the only one on the page. */
.step__note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid rgba(255, 106, 22, 0.4);
  border-radius: var(--radius-chip);
  background-color: var(--seal-wash);
  color: var(--seal-ink);
  font-size: var(--text-body);
  font-weight: 500;
}

.step__note :deep(.icon) {
  flex: none;
  margin-top: 3px;
}

/* Occupies the note's row on cards that have no note, so the subgrid below keeps
   its tracks. Zero height, and hidden from assistive tech. */
.step__note-slot {
  display: block;
  height: 0;
}

.step__output {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
  font-size: var(--text-body);
}

.step__output .mono-label {
  color: var(--text-on-bond-muted);
}

/* ─── Horizontal from 900px ──────────────────────────────────────────── */
@media (min-width: 900px) {
  /*
   * SUBGRID. The four cards share ONE set of row tracks defined here, so
   * head / title / detail / note / output land on identical baselines no matter
   * how long each card's copy is or whether it carries a note.
   *
   * The previous attempt gave each card its own `grid-template-rows` and relied
   * on a `1fr` detail row to absorb the difference. It did not: a card whose
   * detail overflows its share grows that track and pushes everything below it
   * down, so the ledger line drifted by ~25px between cards. Per-card tracks
   * cannot align across cards — only shared tracks can.
   */
  .track {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: auto auto 1fr auto auto;
    column-gap: var(--space-4);
    row-gap: var(--space-3);
  }

  .step {
    display: grid;
    grid-row: span 5;
    grid-template-rows: subgrid;
    gap: 0;
  }

  /* Without subgrid the cards fall back to their flex column: copy still reads
     correctly, only the cross-card baseline is lost. */
  @supports not (grid-template-rows: subgrid) {
    .step {
      display: flex;
      gap: var(--space-3);
    }
  }

  /*
   * Connector across the gap between cards, level with the node's centre
   * (card padding 24px + half the 28px node = 38px). Drawn in the gap only, so
   * it never runs under a card or past the final step.
   */
  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 38px;
    inset-inline-end: calc(-1 * var(--space-4));
    width: var(--space-4);
    height: 2px;
    background-color: var(--seal);
    opacity: 0.45;
    /* Draws left-to-right as the card arrives, so the sequence assembles in
       reading order. `--enter` defaults to 1, so with no motion layer the
       connector is simply present and full-length. */
    transform-origin: left center;
    scale: var(--enter, 1) 1;
  }
}

/* ─── Vertical connector below 900px ─────────────────────────────────── */
@media (max-width: 899px) {
  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: calc(var(--space-5) + 0.875rem - 1px);
    width: 2px;
    height: var(--space-4);
    background-color: var(--seal);
    opacity: 0.45;
    /* Same draw-in as the desktop connector, along the axis the rail follows
       here — downward, from the card it leaves. */
    transform-origin: center top;
    scale: 1 var(--enter, 1);
  }
}
</style>
