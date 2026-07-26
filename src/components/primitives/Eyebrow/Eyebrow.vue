<script setup lang="ts">
/**
 * Eyebrow
 *
 * The mono utility label above a heading (PRD §10.4 "label" role). This is where
 * the site's structural, ops-manual signal lives — uppercase IBM Plex Mono with
 * wide tracking. Used for section labels and step context.
 *
 * Decorative by default: if the eyebrow is not announced as structure, mark it
 * `aria-hidden` via the caller. When it labels a section, give it an id and wire
 * the Section's aria-labelledby to it.
 *
 * @example <Eyebrow>What we do</Eyebrow>
 */
withDefaults(defineProps<{ as?: string }>(), { as: 'p' })
</script>

<template>
  <component :is="as" class="eyebrow">
    <slot />
  </component>
</template>

<style scoped>
.eyebrow {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: var(--text-label);
  line-height: 1.2;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-secondary);
}
</style>
