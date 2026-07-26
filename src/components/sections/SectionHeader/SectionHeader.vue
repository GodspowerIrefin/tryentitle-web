<script setup lang="ts">
/**
 * SectionHeader
 *
 * The shared eyebrow + heading + intro block that opens most home and overview
 * sections. Presentational; all copy via props (PRD §11.3 rule 4). Emits a
 * heading with the given id so the parent Section can wire aria-labelledby.
 */
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'

defineProps<{
  eyebrow: string
  title: string
  titleId: string
  intro?: string
  /** Heading level for correct document outline. Section leads are usually h2. */
  level?: 1 | 2 | 3
}>()
</script>

<template>
  <div class="section-header">
    <Eyebrow>{{ eyebrow }}</Eyebrow>
    <Heading :id="titleId" :level="level ?? 2" size="display-lg">{{ title }}</Heading>
    <p v-if="intro" class="section-header__intro">{{ intro }}</p>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 54ch;
}

.section-header__intro {
  color: var(--text-secondary);
  font-size: var(--text-body-lg);
}
</style>
