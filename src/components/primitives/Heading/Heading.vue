<script setup lang="ts">
/**
 * Heading
 *
 * Display/heading typography primitive. `level` sets the semantic tag (h1–h4)
 * and is kept INDEPENDENT of `size` so heading order can stay correct (one h1
 * per page, no skipped levels — PRD NFR5) while visual scale varies freely.
 *
 * @example <Heading :level="1" size="display-xl">Operations, redesigned</Heading>
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Semantic level → h1…h4. Choose for document outline, not for looks. */
    level?: 1 | 2 | 3 | 4
    /** Visual size token. Defaults to a sensible size for the level. */
    size?: 'display-xl' | 'display-lg' | 'heading-md' | 'heading-sm'
    /** Pass an id so a Section can reference it via aria-labelledby. */
    id?: string
  }>(),
  { level: 2 },
)

const tag = computed(() => `h${props.level}`)
const sizeClass = computed(
  () => `heading--${props.size ?? defaultSizeForLevel(props.level)}`,
)

function defaultSizeForLevel(level: number): string {
  switch (level) {
    case 1:
      return 'display-xl'
    case 2:
      return 'display-lg'
    case 3:
      return 'heading-md'
    default:
      return 'heading-sm'
  }
}
</script>

<template>
  <component :is="tag" :id="id" class="heading" :class="sizeClass">
    <slot />
  </component>
</template>

<style scoped>
.heading {
  font-family: var(--font-display);
  color: var(--text-primary);
  text-wrap: balance;
}

.heading--display-xl {
  font-size: var(--text-display-xl);
  font-weight: 700;
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
}

.heading--display-lg {
  font-size: var(--text-display-lg);
  font-weight: 700;
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
}

.heading--heading-md {
  font-size: var(--text-heading-md);
  font-weight: 600;
  line-height: var(--leading-heading);
  letter-spacing: var(--tracking-display);
}

.heading--heading-sm {
  /* Plex Sans, per PRD §10.4 heading-sm role */
  font-family: var(--font-body);
  font-size: var(--text-heading-sm);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
}
</style>
