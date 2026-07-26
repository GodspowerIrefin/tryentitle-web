<script setup lang="ts">
/**
 * ServicesGrid (PRD FR9)
 *
 * The six core services, each linking to its detail page. A set, not a sequence,
 * so no numbering is used here (PRD §10.7). Presentational; services arrive via
 * props (PRD §11.3 rule 3).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Card from '@/components/primitives/Card'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import type { ServiceSummary } from '@/data/services'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
  items: ServiceSummary[]
  /** Heading level for the section lead. Home uses 2 (hero owns the h1);
   *  the services overview page passes 1. */
  level?: 1 | 2 | 3
}>()
</script>

<template>
  <Section labelledby="services-title" class="services-band">
    <Container>
      <SectionHeader
        :eyebrow="eyebrow"
        :title="title"
        title-id="services-title"
        :intro="intro"
        :level="level"
      />
      <ul class="services">
        <li v-for="service in items" :key="service.slug">
          <Card :to="`/services/${service.slug}`" class="service">
            <span class="service__icon" aria-hidden="true">
              <Icon :name="service.icon" :size="20" />
            </span>
            <h3 class="service__name">{{ service.name }}</h3>
            <p class="service__summary">{{ service.summary }}</p>
            <span class="service__more">
              Explore
              <Icon name="arrow-right" :size="16" />
            </span>
          </Card>
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
.services-band {
  position: relative;
}

.services-band::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.45;
  mask-image: linear-gradient(to bottom, black 0%, transparent 85%);
}

.services-band :deep(.container) {
  position: relative;
}

.services {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .services {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .services {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.service {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  height: 100%;
  background:
    linear-gradient(
      160deg,
      color-mix(in srgb, var(--action-tint) 55%, var(--bg-surface)) 0%,
      var(--bg-surface) 42%
    );
}

.service__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-bottom: var(--space-2);
  color: var(--action-primary);
  background-color: var(--action-tint);
  border: 1px solid color-mix(in srgb, var(--action-primary) 22%, var(--border-subtle));
  border-radius: var(--radius-sm);
}

.service__name {
  font-family: var(--font-display);
  font-size: var(--text-heading-md);
  font-weight: 600;
  letter-spacing: var(--tracking-display);
}

.service__summary {
  color: var(--text-secondary);
  font-size: var(--text-body);
  flex: 1 0 auto;
}

.service__more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  color: var(--action-primary);
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
</style>
