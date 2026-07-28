<script setup lang="ts">
/**
 * ProofCommitments — "Why trust us yet" (design spec §4.11)
 *
 * TryEntitle has no track record, and inventing one is the fastest way to lose a
 * mid-market ops lead. So social proof is replaced with PROCESS proof: what the
 * buyer keeps, how scope is fixed, what happens to their data, and what happens
 * if a workflow does not work.
 *
 * LAYOUT — alternating split rows, after the Flow Genius reference.
 * Each commitment is a full-width row split into a dark MARK panel and a light
 * COPY panel, and the sides swap on every row so the eye zig-zags down the
 * section. Two deliberate departures from the reference:
 *  - The mark panel is a geometric burst, not a photograph. The reference fills
 *    that half with stock imagery; spec §10.2 and PRD §10.8 both rule that out,
 *    and the whole point of this section is not faking things.
 *  - Corners stay at `--radius-card` (4px). The reference uses ~28px; a single
 *    section with soft corners would read as pasted in from another site.
 *
 * The alternation also does structural work: it is the page's ink/bond device
 * (spec §1) applied at row scale, so this section argues in the same visual
 * language as the rest of the page rather than inventing a new one.
 *
 * Motion: each half enters from the side it occupies, so the two converge.
 * Transform-only — see globals.css for why fades are not used.
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Chip from '@/components/primitives/Chip'
import Icon from '@/components/primitives/Icon'
import Button from '@/components/primitives/Button'
import SectionHeader from '@/components/sections/SectionHeader'
import type { ProofCommitment } from '@/data/proof'

withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    items: readonly ProofCommitment[]
    markers?: readonly string[]
  }>(),
  { markers: () => [] },
)

/** Radiating ticks for the mark panel — index drives length so it reads as a burst. */
const TICKS = Array.from({ length: 28 }, (_, i) => (i / 28) * 360)

function marker(i: number): string {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <Section v-if="items.length" tone="bond" labelledby="commitments-title">
    <Container>
      <SectionHeader :eyebrow="eyebrow" :title="title" title-id="commitments-title" />

      <ul class="rows">
        <li
          v-for="(item, i) in items"
          :key="item.title"
          class="row"
          :class="{ 'row--flipped': i % 2 === 1 }"
        >
          <!-- Dark mark panel -->
          <div class="mark on-ink" :data-reveal="i % 2 === 1 ? 'right' : 'left'">
            <p class="mark__label mono-label">{{ item.label }}</p>

            <div class="mark__burst" aria-hidden="true">
              <svg viewBox="0 0 200 200" class="burst">
                <line
                  v-for="(deg, t) in TICKS"
                  :key="t"
                  class="burst__tick"
                  x1="100"
                  :y1="t % 2 === 0 ? 34 : 44"
                  x2="100"
                  y2="66"
                  :transform="`rotate(${deg} 100 100)`"
                />
                <circle class="burst__ring" cx="100" cy="100" r="78" />
              </svg>
              <span class="mark__glyph">
                <Icon :name="item.icon" :size="30" />
              </span>
            </div>

            <p class="mark__index mono-label">{{ marker(i) }}</p>
          </div>

          <!-- Copy panel -->
          <div class="copy" :data-reveal="i % 2 === 1 ? 'left' : 'right'">
            <h3 class="copy__title">{{ item.title }}</h3>
            <p class="copy__body">{{ item.body }}</p>
          </div>
        </li>
      </ul>

      <div v-if="markers.length" class="compliance" data-reveal>
        <ul class="compliance__markers">
          <li v-for="m in markers" :key="m">
            <Chip>{{ m }}</Chip>
          </li>
        </ul>
        <Button to="/security" variant="ghost">
          How we handle your data
          <Icon name="arrow-right" :size="16" />
        </Button>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 860px) {
  .row {
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
    gap: var(--space-4);
  }

  /* Swap the halves on odd rows. `order` rather than `direction` so the DOM
     order — mark, then copy — stays the reading order for a screen reader. */
  .row--flipped .mark {
    order: 2;
  }

  .row--flipped .copy {
    order: 1;
  }
}

/* ─── Mark panel ─────────────────────────────────────────────────────── */
.mark {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  min-height: 210px;
  padding: var(--space-5) var(--space-6);
  background-color: var(--ink);
  border-radius: var(--radius-card);
  overflow: hidden;
}

.mark__label,
.mark__index {
  align-self: flex-start;
  color: var(--seal);
}

.mark__index {
  align-self: flex-end;
  color: var(--text-on-ink-muted);
}

.mark__burst {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(120px, 14vw, 168px);
  aspect-ratio: 1;
}

.burst {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/*
 * NO `transform-origin` here. Each tick carries an SVG `rotate(deg 100 100)`
 * attribute, which already names the viewBox centre as its pivot. A CSS
 * `transform-origin: center` resolves against the LINE's own bounding box
 * instead and compounds with it, which flung the ticks outward into a lopsided
 * arc rather than a ring.
 */
.burst__tick {
  stroke: var(--muted-on-ink);
  stroke-width: 1.5;
  opacity: 0.55;
}

.burst__ring {
  fill: none;
  stroke: var(--seal);
  stroke-width: 1;
  opacity: 0.3;
}

.mark__glyph {
  position: absolute;
  display: inline-flex;
  color: var(--seal);
}

/* The burst turns slowly — one continuous, very low-amplitude motion rather than
   an entrance that repeats. Paused for reduced motion by the block below. */
@media (prefers-reduced-motion: no-preference) {
  .burst {
    animation: burst-turn 90s linear infinite;
  }

  .row:hover .burst__ring {
    opacity: 0.65;
  }

  .burst__ring {
    transition: opacity var(--duration-base) var(--ease-standard);
  }
}

@keyframes burst-turn {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Copy panel ─────────────────────────────────────────────────────── */
.copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-7);
  background-color: var(--bond-raised);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
}

.copy__title {
  font-size: var(--text-h3);
  font-weight: 600;
}

.copy__body {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-lg);
  max-width: 54ch;
}

/* ─── Compliance row ─────────────────────────────────────────────────── */
.compliance {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: var(--space-6);
  padding-top: var(--space-5);
  border-top: 1px solid var(--rule-on-bond);
}

.compliance__markers {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
</style>
