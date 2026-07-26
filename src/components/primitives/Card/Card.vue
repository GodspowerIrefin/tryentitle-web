<script setup lang="ts">
/**
 * Card
 *
 * Elevation-by-border surface (PRD §10.5) — `1px solid var(--border-subtle)` on
 * white, near-square corners, no drop shadow. When `to`/`href` is provided the
 * whole card is a single link, and the hover affordance shifts the border to the
 * signal colour rather than lifting the card.
 *
 * @example <Card to="/services/document-operations"><h3>…</h3></Card>
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  /** Internal route — renders the card as a <RouterLink>. */
  to?: string
  /** External URL — renders the card as an <a>. */
  href?: string
  /** Drop internal padding so media can sit flush to the edges. */
  flush?: boolean
}>()

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'div'
})

const bindings = computed<Record<string, unknown>>(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return {}
})

const interactive = computed(() => Boolean(props.to || props.href))
</script>

<template>
  <component
    :is="tag"
    class="card"
    :class="{ 'card--interactive': interactive, 'card--flush': flush }"
    v-bind="bindings"
  >
    <slot />
  </component>
</template>

<style scoped>
.card {
  display: block;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  color: inherit;
}

.card--flush {
  padding: 0;
}

.card--interactive {
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.card--interactive:hover {
  border-color: var(--action-primary);
}
</style>
