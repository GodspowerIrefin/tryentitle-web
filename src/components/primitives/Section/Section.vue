<script setup lang="ts">
/**
 * Section
 *
 * The ONLY owner of vertical section rhythm on the site (PRD §12.4). Every page
 * band is a Section; nothing else sets `padding-block` or `margin-block`. This
 * structurally prevents the most common marketing-build bug: competing spacing
 * rules that cancel or double up.
 *
 * Section also declares the BAND. The page alternates between `ink` (dark —
 * where the problem lives) and `bond` (light paper — where the solution lives),
 * and the visitor scrolls from mess into order (design spec §1).
 *
 * `tone="ink"` adds the `.on-ink` class, which is the single hook every other
 * component uses to pick band-correct text, rule, and accent colours. Any
 * component that renders on both bands should style against `.on-ink`, never
 * re-declare its own dark variant.
 *
 * @example <Section tone="ink"><Container>…</Container></Section>
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Which ground this band paints. `bond` is light paper, `ink` is dark. */
    tone?: 'bond' | 'bond-raised' | 'ink' | 'ink-raised'
    /** Tighten the vertical rhythm for dense, secondary bands. */
    density?: 'default' | 'compact'
    /** Landmark element to render. Defaults to a plain section. */
    as?: string
    /** id of the heading that labels this region, for aria-labelledby. */
    labelledby?: string
  }>(),
  { tone: 'bond', density: 'default', as: 'section' },
)

const isInk = computed(() => props.tone === 'ink' || props.tone === 'ink-raised')

const classes = computed(() => [
  'section',
  `section--${props.tone}`,
  props.density === 'compact' ? 'section--compact' : null,
  isInk.value ? 'on-ink' : null,
])
</script>

<template>
  <component :is="as" :class="classes" :aria-labelledby="labelledby">
    <slot />
  </component>
</template>

<style scoped>
.section {
  /* The single definition of section rhythm — 72px mobile → 128px desktop. */
  padding-block: var(--section-rhythm);
  position: relative;
}

.section--compact {
  padding-block: var(--section-rhythm-compact);
}

.section--bond {
  background-color: var(--bond);
  color: var(--text-on-bond);
}

.section--bond-raised {
  background-color: var(--bond-raised);
  color: var(--text-on-bond);
}

.section--ink {
  background-color: var(--ink);
  color: var(--text-on-ink);
}

.section--ink-raised {
  background-color: var(--ink-raised);
  color: var(--text-on-ink);
}
</style>
