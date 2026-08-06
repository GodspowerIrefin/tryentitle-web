<script setup lang="ts">
/**
 * IndustriesMarquee — homepage-only Bond band.
 *
 * A full-bleed greige tray inset into the bond band, carrying one ribbon of
 * cream industry dossier tiles (Professional Services omitted — too generic for
 * this wall). The tray is the point: the sections either side are both bond, so
 * cards on the same paper would read as nothing. A tray one step darker and
 * warmer than bond makes the band an anchor without punching a black hole
 * through the middle of the page, and gives the cards an edge to sit on.
 *
 * Links to detail pages. Pauses on hover/focus. Reduced motion: static wrap, no
 * horizontal page scroll (NFR1).
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import { INDUSTRIES } from '@/data/industries'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
  note: string
  noteCta?: string
}>()

/** Two identical tracks — shift by one track plus one gap for a seamless loop. */
const LOOP = 2

const items = INDUSTRIES.filter((i) => i.slug !== 'professional-services')

/** Full catalog index, so FIELD 01–07 stay stable even though one is omitted. */
const fieldNumbers = new Map(INDUSTRIES.map((item, i) => [item.slug, i + 1]))

const workflowCount = computed(() =>
  items.reduce((total, industry) => total + industry.workflows.length, 0),
)

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function fieldCode(slug: string): string {
  return pad(fieldNumbers.get(slug) ?? 0)
}
</script>

<template>
  <Section tone="bond" class="industries-marquee" labelledby="industries-title">
    <Container>
      <div data-reveal>
        <SectionHeader
          :eyebrow="eyebrow"
          :title="title"
          title-id="industries-title"
          :aside="intro ?? ''"
        />

        <!--
          Separators are pseudo-elements on each item rather than markup of their
          own, so hiding an item (the input-specific hints below) takes its
          separator with it and never strands a trailing dot.
        -->
      </div>
    </Container>

    <div class="ribbon" data-reveal>
      <div class="ribbon__viewport" aria-label="Industries">
        <div class="ribbon__row">
          <!--
            The clone is hidden from assistive tech and taken out of the tab order
            (duplicate links otherwise), but it must stay pointer-interactive: at
            any moment roughly half the visible strip is the clone, and `inert`
            here left those tiles dead to hover and clicks.
          -->
          <ul
            v-for="copy in LOOP"
            :key="`track-${copy}`"
            class="ribbon__track"
            :aria-hidden="copy > 1 || undefined"
          >
            <li v-for="industry in items" :key="`${copy}-${industry.slug}`">
              <RouterLink
                :to="`/industries/${industry.slug}`"
                class="tile"
                :tabindex="copy > 1 ? -1 : undefined"
              >
                <!-- <span class="tile__stamp" aria-hidden="true">{{ fieldCode(industry.slug) }}</span> -->

                <span class="tile__head">
                  <span class="tile__icon" aria-hidden="true">
                    <Icon :name="industry.icon" :size="20" />
                  </span>
                </span>

                <span class="tile__name">{{ industry.name }}</span>

                <span class="tile__outcome">{{ industry.outcome }}</span>

                <span class="tile__cta">
                  Learn more
                  <Icon name="arrow-right" :size="14" class="tile__arrow" />
                </span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Section>
</template>

<style scoped>
.industries-marquee {
  /* The tray is full-bleed; nothing may push the page sideways (NFR1). */
  overflow: clip;

  /*
   * Local washes, kept in one place so the tray reads as one material.
   *
   * Neither a wall of seal nor a slab of ink: the band is now a warm greige tray
   * — bond with graphite mixed in and a few points of seal to keep it off neutral
   * — carrying cream document cards. Separation comes from tone and shadow rather
   * than a hard light/dark flip, which is what let the old ink tray fight the bond
   * sections either side of it. The orange is left to do accent work only: the
   * spine tab, the icon chip, the CTA.
   */
  /*
   * The warmth is mixed into the base, not laid over the top as a wash. A seal
   * gradient on a neutral grey leaves the top pink and the bottom cold, and the
   * hand-off between them reads as a band across the tray.
   */
  --tray-grey: color-mix(in srgb, var(--bond) 88%, var(--graphite) 12%);
  --tray-base: color-mix(in srgb, var(--tray-grey) 96%, var(--seal) 4%);
  --tray-stock: color-mix(in srgb, var(--tray-grey) 92%, var(--seal) 8%);
  --tray-wash: color-mix(in srgb, var(--seal) 5%, transparent);
  --tray-rule: color-mix(in srgb, var(--ink) 6%, transparent);
  /* Cream, not white — the card has to stay warmer than the tray it sits on. */
  --tile-stock: color-mix(in srgb, var(--bond-raised) 93%, var(--seal) 7%);
  --tile-stock-low: color-mix(in srgb, var(--bond-raised) 96%, var(--seal) 4%);
  --tile-edge: color-mix(in srgb, var(--ink) 15%, transparent);
  --tile-stamp: color-mix(in srgb, var(--ink) 8%, transparent);
  /* Distance the ribbon dissolves over at each end of the tray. */
  --ribbon-fade: clamp(1.5rem, 8vw, 9rem);
  --marquee-duration: 48s;
}

/* ─── Ledger line under the header ───────────────────────────────────── */
.ledger {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
  color: var(--text-on-bond-muted);
}

.ledger__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.ledger__item + .ledger__item::before {
  content: '';
  width: 3px;
  height: 3px;
  flex: none;
  border-radius: 50%;
  background-color: var(--rule-hover);
}

.ledger__stat {
  color: var(--seal-ink);
  font-weight: 600;
}

/* The affordance differs by input, so only one of the two hints is ever shown. */
.ledger__hint--touch {
  display: none;
}

@media (hover: none), (pointer: coarse) {
  .ledger__hint {
    display: none;
  }

  .ledger__hint--touch {
    display: inline-flex;
  }
}

/* ─── The ink tray ───────────────────────────────────────────────────── */
.ribbon {
  position: relative;
  margin-top: var(--space-7);
  padding-block: var(--space-7);
  /* Warm at the top edge, settling into greige — depth under the cards. */
  background:
    radial-gradient(140% 180% at 50% -40%, var(--tray-wash), transparent 70%),
    linear-gradient(180deg, var(--tray-stock) 0%, var(--tray-base) 85%);
  color: var(--text-on-bond);
  /* Bottom hairline only — the top edge is the seal cap drawn below. */
  border-bottom: 1px solid var(--rule-on-bond);
}

/* Ledger ruling — faint vertical hairlines, so the tray reads as filed stock
   rather than a flat black bar. Fades out top and bottom. */
.ribbon::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(90deg, var(--tray-rule) 0 1px, transparent 1px 96px);
  mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
  pointer-events: none;
}

/* A seal hairline caps the tray — the filing edge. */
.ribbon::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--seal) 14%, var(--seal) 86%, transparent);
  pointer-events: none;
}

.ribbon__viewport {
  position: relative;
  /* REQUIRED: tracks are wider than the viewport (NFR1). */
  overflow: hidden;
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 var(--ribbon-fade),
    #000 calc(100% - var(--ribbon-fade)),
    transparent
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent,
    #000 var(--ribbon-fade),
    #000 calc(100% - var(--ribbon-fade)),
    transparent
  );
  /* Room for the hover lift and the focus ring to render uncropped. */
  padding-block: var(--space-3);
}

.ribbon__row {
  display: flex;
  width: max-content;
  gap: var(--space-4);
}

.ribbon__track {
  display: flex;
  gap: var(--space-4);
  flex: none;
  margin: 0;
  padding: 0;
  list-style: none;
}

/*
 * Card width lives on the list item, not the card. The card sizing itself off a
 * content-sized `li` makes its `100%` circular, and the tiles come out at
 * different widths per wrapped row in the static fallback below.
 */
.ribbon__track > li {
  display: flex;
  width: min(21rem, 80vw);
}

/* ─── Dossier tile ───────────────────────────────────────────────────── */
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  min-height: 19.5rem;
  padding: var(--space-5);
  background: linear-gradient(170deg, var(--tile-stock) 0%, var(--tile-stock-low) 78%);
  border: 1px solid var(--tile-edge);
  border-radius: var(--radius-card);
  color: var(--ink);
  text-decoration: none;
  overflow: hidden;
  /* No drop shadow — the card sits flat on the tray and the edge carries the
     separation, which is why that border is a shade heavier than a card on bond
     would need. */
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

/* Filing tab down the spine — the seal marker, fills on hover. */
.tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background-color: var(--seal);
  transform: scaleY(0.22);
  transform-origin: top;
  transition: transform var(--duration-base) var(--ease-standard);
}

.tile:hover,
.tile:focus-visible {
  border-color: var(--seal);
  outline: none;
}

.tile:focus-visible {
  outline: 2px solid var(--seal);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: no-preference) {
  .tile:hover,
  .tile:focus-visible {
    transform: translateY(-6px);
  }

  .tile:hover::before,
  .tile:focus-visible::before {
    transform: scaleY(1);
  }

  .tile:hover .tile__arrow,
  .tile:focus-visible .tile__arrow {
    transform: translateX(4px);
  }
}

/* Ghost field number, watermarked into the stock. */
.tile__stamp {
  position: absolute;
  top: -0.6rem;
  right: 0.35rem;
  font-family: var(--font-display);
  font-size: 6rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: var(--tracking-display);
  color: var(--tile-stamp);
  pointer-events: none;
  transition: color var(--duration-base) var(--ease-standard);
}

.tile:hover .tile__stamp,
.tile:focus-visible .tile__stamp {
  color: color-mix(in srgb, var(--ink) 18%, transparent);
}

.tile__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.tile__meta {
  color: var(--ink);
}

.tile__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex: none;
  border-radius: var(--radius-card);
  background-color: var(--ink);
  color: var(--seal);
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.tile:hover .tile__icon,
.tile:focus-visible .tile__icon {
  background-color: var(--seal);
  color: var(--ink);
}

.tile__name {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.2rem + 0.9vw, 1.875rem);
  font-weight: 600;
  font-variation-settings: 'wdth' 95;
  letter-spacing: var(--tracking-display);
  line-height: 1.05;
  color: var(--ink);
  text-wrap: balance;
}

/*
 * The outcome sits on the rule the workflow rail used to draw, and takes the
 * slack in the tile so the CTA still lands on the bottom edge whether the copy
 * runs to three lines or five.
 */
.tile__outcome {
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
  font-size: var(--text-body-sm);
  line-height: 1.45;
  color: var(--text-on-bond-muted);
  text-wrap: pretty;
}

.tile__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  font-weight: 600;
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  /* Body-size accent text on paper — the 5.4:1 variant, not raw seal (2.6:1). */
  color: var(--seal-ink);
}

.tile__arrow {
  transition: transform var(--duration-fast) var(--ease-standard);
}

/* ─── Drift ──────────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: no-preference) {
  .ribbon__row {
    animation: industries-drift var(--marquee-duration) linear infinite;
  }

  .ribbon__viewport:hover .ribbon__row,
  .ribbon__viewport:focus-within .ribbon__row {
    animation-play-state: paused;
  }
}

@keyframes industries-drift {
  from {
    transform: translateX(0);
  }
  to {
    /* One track plus one gap: 50% of the row is a track plus HALF a gap. */
    transform: translateX(calc(-50% - var(--space-4) / 2));
  }
}

/*
 * Touch: swipe, don't drift.
 *
 * The drift is paused by hover, and a coarse pointer has none — so on a phone a
 * card a visitor wants to read simply slides away and there is nothing they can
 * do about it. Here the same strip becomes a snapping swipe rail instead, which
 * is the affordance a thumb already expects. The duplicate track is dropped so
 * the list has a real end to swipe to.
 */
@media (hover: none), (pointer: coarse) {
  .ribbon__viewport {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;
    /* The end fades would hide the first and last card at rest. */
    mask-image: none;
    -webkit-mask-image: none;
  }

  .ribbon__viewport::-webkit-scrollbar {
    display: none;
  }

  .ribbon__row {
    animation: none;
    padding-inline: var(--gutter);
  }

  .ribbon__track[aria-hidden='true'] {
    display: none;
  }

  .tile {
    scroll-snap-align: start;
  }
}

/* ─── Foot ───────────────────────────────────────────────────────────── */
.foot {
  display: grid;
  gap: var(--space-7);
  margin-top: var(--space-8);
}

@media (min-width: 900px) {
  .foot {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-8);
    align-items: start;
  }
}

.foot__index,
.invite {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--rule-on-bond);
}

.foot__label,
.invite__label {
  color: var(--seal-ink);
}

.foot__text,
.invite__text {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body);
  max-width: 46ch;
}

.foot__index :deep(a),
.invite :deep(a) {
  margin-top: var(--space-2);
}

/* ─── Reduced motion — static wall, no drift, no horizontal overflow ─── */
@media (prefers-reduced-motion: reduce) {
  .ledger__hint,
  .ledger__hint--touch {
    display: none;
  }

  .ribbon__viewport {
    mask-image: none;
    -webkit-mask-image: none;
    overflow: visible;
  }

  /*
   * Capped at three cards plus their gaps rather than the full content measure:
   * left wider, flex-wrap fits four on the first line and strands two on the
   * second. This width wraps to a clean 3 / 3, then 2 and 1 as it narrows, with
   * no breakpoint of its own.
   */
  .ribbon__row {
    width: auto;
    max-width: calc(19rem * 3 + var(--space-4) * 2 + var(--gutter) * 2);
    margin-inline: auto;
    padding-inline: var(--gutter);
    flex-wrap: wrap;
    justify-content: center;
  }

  /*
   * `flex: none` is what makes the drifting track wider than the viewport; here
   * it is exactly what must go. Left in place the track keeps its max-content
   * width and the "wrapped" wall is still one long row running off both edges.
   */
  .ribbon__track {
    flex: 1 1 auto;
    min-width: 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ribbon__track[aria-hidden='true'] {
    display: none;
  }

  .ribbon__track > li {
    width: min(19rem, 100%);
  }

  .tile::before {
    transform: none;
    height: 3px;
    width: 100%;
  }
}
</style>
