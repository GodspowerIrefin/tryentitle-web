<script setup lang="ts">
/**
 * Icon
 *
 * A small, hand-picked set of single-weight line icons (1.5px stroke, 24px grid,
 * `currentColor`) drawn from one geometric family (PRD §10.8). No icon library
 * is dumped in wholesale — every glyph here is used somewhere on the site.
 *
 * Accessibility: icons are decorative by default (`aria-hidden`). When an icon
 * is the only content of a control, pass a `title` so it is announced.
 *
 * @example <Icon name="arrow-right" />
 */
import { computed } from 'vue'
import { ICON_PATHS, type IconName } from './icons'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number
    /** Accessible name. When omitted the icon is aria-hidden (decorative). */
    title?: string
  }>(),
  { size: 24 },
)

const d = computed(() => ICON_PATHS[props.name])
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : true"
    :aria-label="title"
  >
    <title v-if="title">{{ title }}</title>
    <path :d="d" />
  </svg>
</template>

<style scoped>
.icon {
  display: inline-block;
  flex: none;
  vertical-align: middle;
}
</style>
