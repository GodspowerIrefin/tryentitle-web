<script setup lang="ts">
/**
 * Section
 *
 * The ONLY owner of vertical section rhythm on the site (PRD §12.4). Every page
 * band is a Section; nothing else sets `padding-block` or `margin-block`. This
 * structurally prevents the most common marketing-build bug: competing spacing
 * rules that cancel or double up.
 *
 * `tone="inverse"` paints the dark canvas. Per PRD §10.3 this is used for
 * exactly two bands site-wide (closing CTA and footer) so the shift to dark
 * reads as punctuation, not decoration.
 *
 * Renders a <section> with the given aria-labelledby wiring left to the caller.
 *
 * @example <Section tone="inverse"><Container>…</Container></Section>
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Surface tone. `canvas` (paper) default, `surface` (white), `inverse` (ink). */
    tone?: 'canvas' | 'surface' | 'inverse'
    /** Tighten the vertical rhythm for dense, secondary bands. */
    density?: 'default' | 'compact'
    /** Landmark element to render. Defaults to a plain section. */
    as?: string
    /** id of the heading that labels this region, for aria-labelledby. */
    labelledby?: string
  }>(),
  { tone: 'canvas', density: 'default', as: 'section' },
)

const classes = computed(() => [
  'section',
  `section--${props.tone}`,
  props.density === 'compact' ? 'section--compact' : null,
])
</script>

<template>
  <component :is="as" :class="classes" :aria-labelledby="labelledby">
    <slot />
  </component>
</template>

<style scoped>
.section {
  /* The single definition of section rhythm (PRD §10.5). */
  padding-block: clamp(4rem, 8vw, 8rem);
}

.section--compact {
  padding-block: clamp(2.5rem, 5vw, 4rem);
}

.section--canvas {
  background-color: var(--bg-canvas);
  color: var(--text-primary);
}

.section--surface {
  background-color: var(--bg-surface);
  color: var(--text-primary);
}

.section--inverse {
  background-color: var(--bg-inverse);
  color: var(--text-inverse);
}
</style>
