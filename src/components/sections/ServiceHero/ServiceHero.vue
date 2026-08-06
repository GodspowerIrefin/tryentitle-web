<script setup lang="ts">
/**
 * ServiceHero — Ink intro band for a service detail page.
 *
 * Gives the page a product-like first screen: icon tile, outcome headline,
 * chips, and a booking CTA — before the long-form prose. Presentational; all
 * content arrives via props (PRD §11.3 rules 3–4).
 */
import { RouterLink } from 'vue-router'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Chip from '@/components/primitives/Chip'
import Icon, { type IconName } from '@/components/primitives/Icon'
import BookingButton from '@/components/marketing/BookingButton'

interface Crumb {
  label: string
  to?: string
}

defineProps<{
  breadcrumbs: Crumb[]
  eyebrow: string
  title: string
  headline: string
  summary: string
  chips: readonly string[]
  icon: IconName
}>()
</script>

<template>
  <Section tone="ink" class="service-hero" labelledby="service-title">
    <Container>
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol>
          <li v-for="(crumb, i) in breadcrumbs" :key="i">
            <RouterLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</RouterLink>
            <span v-else aria-current="page">{{ crumb.label }}</span>
          </li>
        </ol>
      </nav>

      <div class="hero">
        <div class="hero__copy">
          <span class="hero__tile" aria-hidden="true">
            <Icon :name="icon" :size="28" />
          </span>
          <Eyebrow>{{ eyebrow }}</Eyebrow>
          <Heading id="service-title" :level="1" size="h1">{{ title }}</Heading>
          <p class="hero__headline">{{ headline }}</p>
          <p class="hero__summary">{{ summary }}</p>

          <ul v-if="chips.length" class="hero__chips">
            <li v-for="chip in chips" :key="chip">
              <Chip tone="seal" marker>{{ chip }}</Chip>
            </li>
          </ul>

          <div class="hero__actions">
            <BookingButton placement="service-hero" size="lg" />
            <a class="hero__jump" href="#service-body">Read how it works</a>
          </div>
        </div>

        <aside class="hero__rail" aria-hidden="true">
          <div class="hero__grid" />
          <div class="hero__mark">
            <Icon :name="icon" :size="120" />
          </div>
        </aside>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.crumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-ink-muted);
}

.crumbs li:not(:last-child)::after {
  content: '/';
  margin-inline-start: var(--space-2);
  color: var(--rule-on-ink);
}

.crumbs a {
  color: var(--text-on-ink-muted);
}

.crumbs a:hover {
  color: var(--text-on-ink);
}

.hero {
  display: grid;
  gap: var(--space-8);
  margin-top: var(--space-6);
  align-items: center;
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: var(--space-9);
  }
}

.hero__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 40rem;
}

.hero__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: var(--radius-card);
  color: var(--seal);
  background-color: rgba(242, 243, 240, 0.08);
  border: 1px solid var(--rule-on-ink);
  margin-bottom: var(--space-2);
}

.hero__headline {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 400;
  letter-spacing: var(--tracking-display);
  line-height: 1.15;
  color: var(--text-on-ink);
  max-width: 22ch;
}

.hero__summary {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-lg);
  max-width: var(--measure);
}

.hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-3);
}

.hero__jump {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-ink-muted);
  border-bottom: 1px solid var(--rule-on-ink);
  padding-bottom: 2px;
}

.hero__jump:hover {
  color: var(--text-on-ink);
}

.hero__rail {
  position: relative;
  display: none;
  min-height: 280px;
  border: 1px solid var(--rule-on-ink);
  border-radius: var(--radius-card);
  overflow: hidden;
  background:
    radial-gradient(ellipse at 70% 30%, rgba(255, 106, 22, 0.18), transparent 55%),
    radial-gradient(ellipse at 20% 80%, rgba(47, 169, 140, 0.12), transparent 50%),
    var(--ink-raised);
}

@media (min-width: 960px) {
  .hero__rail {
    display: block;
  }
}

.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--rule-on-ink) 1px, transparent 1px),
    linear-gradient(90deg, var(--rule-on-ink) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.55;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}

.hero__mark {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: color-mix(in srgb, var(--seal) 55%, transparent);
}
</style>
