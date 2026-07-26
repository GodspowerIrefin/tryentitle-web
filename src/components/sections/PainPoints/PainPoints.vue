<script setup lang="ts">
/**
 * PainPoints (PRD FR8)
 *
 * Names the manual, document-heavy work as observable symptoms — not features.
 * Presentational: the symptom list and optional editorial image arrive via
 * props (PRD §11.3 rule 3).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import type { PainPoint } from '@/data/pain-points'

defineProps<{
  eyebrow: string
  title: string
  intro?: string
  items: PainPoint[]
  image?: { src: string; alt: string }
}>()
</script>

<template>
  <Section tone="surface" labelledby="painpoints-title">
    <Container>
      <div class="painpoints-layout" :class="{ 'painpoints-layout--with-media': image }">
        <div class="painpoints-layout__copy">
          <SectionHeader
            :eyebrow="eyebrow"
            :title="title"
            title-id="painpoints-title"
            :intro="intro"
          />
          <ul class="painpoints">
            <li v-for="item in items" :key="item.id" class="painpoint">
              <span class="painpoint__icon" aria-hidden="true">
                <Icon :name="item.icon" :size="22" />
              </span>
              <div>
                <h3 class="painpoint__label">{{ item.label }}</h3>
                <p class="painpoint__symptom">{{ item.symptom }}</p>
              </div>
            </li>
          </ul>
        </div>

        <figure v-if="image" class="painpoints-layout__media">
          <img
            :src="image.src"
            :alt="image.alt"
            width="1600"
            height="1200"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.painpoints-layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.painpoints {
  display: grid;
  gap: var(--space-5);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .painpoints {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.painpoints-layout--with-media .painpoints {
  grid-template-columns: 1fr;
}

@media (min-width: 960px) {
  .painpoints-layout--with-media {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: var(--space-8);
    align-items: start;
  }

  .painpoints-layout--with-media .painpoints {
    grid-template-columns: 1fr;
  }
}

.painpoint {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}

.painpoint__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  color: var(--action-primary);
  background-color: var(--action-tint);
  border: 1px solid color-mix(in srgb, var(--action-primary) 22%, var(--border-subtle));
  border-radius: var(--radius-sm);
  padding-top: 0;
}

.painpoint__label {
  font-family: var(--font-body);
  font-size: var(--text-heading-sm);
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.painpoint__symptom {
  color: var(--text-secondary);
  font-size: var(--text-body);
}

.painpoints-layout__media {
  margin: 0;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background-color: var(--color-ink-900);
  position: relative;
}

.painpoints-layout__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--color-signal-600) 22%, transparent) 0%,
    color-mix(in srgb, var(--color-ink-900) 40%, transparent) 100%
  );
  pointer-events: none;
}

.painpoints-layout__media img {
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
  aspect-ratio: 4 / 5;
  filter: saturate(0.7) contrast(1.06);
}

@media (min-width: 960px) {
  .painpoints-layout__media {
    position: sticky;
    top: calc(var(--header-height) + var(--space-5));
  }

  .painpoints-layout__media img {
    min-height: 420px;
    aspect-ratio: 3 / 4;
  }
}
</style>
