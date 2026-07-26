<script setup lang="ts">
/**
 * Logo — TryEntitle wordmark.
 *
 * PLACEHOLDER pending PRD D3 (final SVG wordmark + monochrome variant). This is
 * a typographic mark in the display face with a single brass exception tick, so
 * the header/footer are complete and on-brand until the real asset lands.
 *
 * `tone="inverse"` is the monochrome-on-dark variant for the footer.
 *
 * @example <Logo /> · <Logo tone="inverse" />
 */
withDefaults(defineProps<{ tone?: 'default' | 'inverse' }>(), { tone: 'default' })
</script>

<template>
  <span class="logo" :class="`logo--${tone}`" aria-label="TryEntitle">
    <span aria-hidden="true">TryEntitle</span>
    <span class="logo__mark" aria-hidden="true" />
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  line-height: 1;
}

.logo--default {
  color: var(--text-primary);
}

.logo--inverse {
  color: var(--text-inverse);
}

/* The exception tick — brass, non-text (PRD §10.3) */
.logo__mark {
  width: 6px;
  height: 6px;
  background-color: var(--accent-exception);
  align-self: flex-end;
  margin-bottom: 3px;
}
</style>
