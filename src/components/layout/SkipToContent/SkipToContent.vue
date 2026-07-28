<script setup lang="ts">
/**
 * SkipToContent
 *
 * The first focusable element on every page (PRD NFR5). Visually hidden until it
 * receives keyboard focus, then it appears and jumps focus to the <main>
 * landmark, letting keyboard users bypass the header and nav.
 *
 * @example <SkipToContent /> (rendered once, at the top of the app shell)
 */
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
</template>

<style scoped>
.skip {
  position: absolute;
  left: var(--space-3);
  top: var(--space-3);
  z-index: 100;
  transform: translateY(-150%);
  background-color: var(--seal);
  color: var(--text-on-ink);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-chip);
  font-weight: 600;
  transition: transform var(--duration-fast) var(--ease-standard);
}

.skip:focus {
  transform: translateY(0);
  color: var(--text-on-ink);
}
</style>
