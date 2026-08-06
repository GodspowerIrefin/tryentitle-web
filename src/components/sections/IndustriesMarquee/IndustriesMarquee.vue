<script setup lang="ts">
/**
 * IndustriesMarquee — homepage-only Bond band.
 *
 * A full-bleed INK tray inset into the bond band, carrying one ribbon of
 * industry dossier tiles (Professional Services omitted — too generic for this
 * wall). The tray is the point: the surrounding sections either side of this one
 * are both bond, so a light ribbon on light paper reads as nothing. Dropping the
 * ribbon onto ink gives the seal somewhere to burn and makes the band the visual
 * anchor of the lower page without breaking Section's band contract.
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

    <div class="ribbon on-ink" data-reveal>
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

  /* Local washes, kept in one place so the tray reads as one material. */
  --tray-wash: rgba(255, 106, 22, 0.12);
  --tray-rule: rgba(242, 243, 240, 0.08);
  --tile-wash: rgba(255, 106, 22, 0.1);
  --tile-stamp: color-mix(in srgb, var(--ink) 10%, transparent);
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
  background: radial-gradient(110% 160% at 50% -30%, var(--tray-wash), transparent 62%), var(--ink);
  color: var(--text-on-ink);
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
  background: var(--seal);
  border: 1px solid color-mix(in srgb, var(--ink) 18%, var(--seal));
  border-radius: var(--radius-card);
  color: var(--ink);
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0 12px 28px color-mix(in srgb, var(--seal) 28%, transparent);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

/* Filing tab down the spine — fills on hover. */
.tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background-color: var(--ink);
  transform: scaleY(0.18);
  transform-origin: top;
  transition: transform var(--duration-base) var(--ease-standard);
}

.tile:hover,
.tile:focus-visible {
  border-color: var(--ink);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--seal) 40%, transparent);
  outline: none;
}

.tile:focus-visible {
  outline: 2px solid var(--ink);
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
  border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
  border-radius: var(--radius-card);
  background-color: var(--ink);
  color: var(--seal);
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
  border-top: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
  font-size: var(--text-body-sm);
  line-height: 1.45;
  color: color-mix(in srgb, var(--ink) 75%, transparent);
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
  color: var(--ink);
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
