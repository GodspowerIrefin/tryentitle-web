<script setup lang="ts">
/**
 * Heading
 *
 * Display/heading typography primitive. `level` sets the semantic tag (h1–h4)
 * and is kept INDEPENDENT of `size` so heading order can stay correct (one h1
 * per page, no skipped levels — PRD NFR5) while visual scale varies freely.
 *
 * TYPE NOTE: the design spec restricts Bricolage Grotesque to H1–H2 (§1
 * Typography). Its card-anatomy sketch (§2) annotates the card headline as
 * "H3, display face", which contradicts that rule. The normative type table
 * wins: `h3` renders in Instrument Sans, which keeps the display face rare
 * enough to stay an event. Pass `size="h2"` on a level-3 heading if a specific
 * card genuinely needs display treatment.
 *
 * @example <Heading :level="1" size="h1">Operations, rebuilt</Heading>
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Semantic level → h1…h4. Choose for document outline, not for looks. */
    level?: 1 | 2 | 3 | 4
    /** Visual size token. Defaults to a sensible size for the level. */
    size?: 'h1' | 'h2' | 'h3'
    /** Pass an id so a Section can reference it via aria-labelledby. */
    id?: string
  }>(),
  { level: 2 },
)

const tag = computed(() => `h${props.level}`)
const sizeClass = computed(() => `heading--${props.size ?? defaultSizeForLevel(props.level)}`)

function defaultSizeForLevel(level: number): string {
  if (level === 1) return 'h1'
  if (level === 2) return 'h2'
  return 'h3'
}
</script>

<template>
  <component :is="tag" :id="id" class="heading" :class="sizeClass">
    <slot />
  </component>
</template>

<style scoped>
.heading {
  color: inherit;
  text-wrap: balance;
}

.heading--h1,
.heading--h2 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-display);
  font-variation-settings: 'wdth' 95;
}

.heading--h1 {
  font-size: var(--text-h1);
}

.heading--h2 {
  font-size: var(--text-h2);
}

.heading--h3 {
  font-family: var(--font-body);
  font-size: var(--text-h3);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
</style>
