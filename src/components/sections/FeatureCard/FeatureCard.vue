<script setup lang="ts">
/**
 * FeatureCard
 *
 * The one card skeleton used across the site — services, industries, pain
 * points, insights. Enforcing a single anatomy is what makes the site feel
 * designed rather than assembled (design spec §2).
 *
 * Anatomy, in order:
 *   icon tile · mono eyebrow · headline · one-line benefit · example chips ·
 *   inline text CTA with arrow
 *
 * Every element except the headline and benefit is optional, so the same
 * skeleton covers a pain-point card (no CTA, one stat chip) and a service card
 * (icon, chips, CTA) without a second component existing.
 *
 * Presentational: all content arrives via props (PRD §11.3 rule 3). The whole
 * card is the link when `to` is set, so the CTA row is a <span>, never a nested
 * <a> — a link inside a link is invalid and breaks keyboard navigation.
 */
import Card from '@/components/primitives/Card'
import Chip from '@/components/primitives/Chip'
import Icon, { type IconName } from '@/components/primitives/Icon'

withDefaults(
  defineProps<{
    /** Mono eyebrow — the record-entry label. */
    eyebrow?: string
    /** Card headline. */
    title: string
    /** One-line promise: what changes for them, in plain language. */
    body: string
    /** Example chips, e.g. Intake forms / Contracts / Claims. */
    chips?: readonly string[]
    /** Icon for the 40px tile. */
    icon?: IconName
    /** Inline CTA label. Rendered with a nudging arrow. */
    cta?: string
    /** Internal route making the whole card a link. */
    to?: string
    /** A single stat callout pinned to the top-right (pain-point cards). */
    stat?: string
    /** Tone for the stat chip. `redline` marks a cost in the before-state. */
    statTone?: 'neutral' | 'seal' | 'verify' | 'redline'
    /** Heading level, for correct document outline. */
    level?: 2 | 3 | 4
    /** `marked` adds Card's seal head-rule. Not a fill — see tokens.css. */
    surface?: 'default' | 'marked'
  }>(),
  { statTone: 'redline', level: 3, surface: 'default' },
)
</script>

<template>
  <Card :to="to" class="fcard" :surface="surface">
    <div v-if="icon || stat" class="fcard__top">
      <span v-if="icon" class="fcard__tile" aria-hidden="true">
        <Icon :name="icon" :size="20" />
      </span>
      <!-- <Chip v-if="stat" :tone="statTone" class="fcard__stat">{{ stat }}</Chip> -->
    </div>

    <p v-if="eyebrow" class="fcard__eyebrow mono-label">{{ eyebrow }}</p>

    <component :is="`h${level}`" class="fcard__title">{{ title }}</component>

    <p class="fcard__body">{{ body }}</p>

    <ul v-if="chips?.length" class="fcard__chips">
      <li v-for="chip in chips" :key="chip">
        <Chip marker>{{ chip }}</Chip>
      </li>
    </ul>

    <span v-if="cta" class="fcard__cta">
      {{ cta }}
      <Icon name="arrow-right" :size="16" class="fcard__arrow" />
    </span>
  </Card>
</template>

<style scoped>
.fcard {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  height: 100%;
}

.fcard__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

/* 40px icon tile — seal accent on bond and orange cards. */
.fcard__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: var(--radius-card);
  background-color: var(--seal);
  color: var(--ink);
}

/* The tile is where seal earns its keep on a dark band — a small saturated mark
   against `--ink-raised`, rather than the card itself going orange. */
.on-ink .fcard__tile {
  background-color: var(--seal);
  color: var(--ink);
  border: none;
}

.fcard__stat {
  margin-inline-start: auto;
}

.fcard__eyebrow {
  color: var(--seal-ink);
}

.on-ink .fcard__eyebrow {
  color: var(--seal);
}

.fcard__title {
  font-family: var(--font-body);
  font-size: var(--text-h3);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.on-ink .fcard__title {
  color: var(--text-on-ink);
}

.fcard__body {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body);
  /* Push the chips and CTA to the card foot so ragged copy lengths still line
     up across a row. */
  flex: 1 0 auto;
}

.on-ink .fcard__body {
  color: var(--text-on-ink-muted);
}

.fcard__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.fcard__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
  font-weight: 600;
  font-size: var(--text-body);
  color: var(--seal-ink);
}

.on-ink .fcard__cta {
  border-top-color: var(--rule-on-ink);
  color: var(--seal);
}

/* Arrow nudge — the third cue of the single hover gesture (spec §2). */
.fcard__arrow {
  transition: transform var(--duration-fast) var(--ease-standard);
}

@media (prefers-reduced-motion: no-preference) {
  .fcard:hover .fcard__arrow {
    transform: translateX(4px);
  }
}
</style>
