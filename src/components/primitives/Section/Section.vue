<script setup lang="ts">
/**
 * Section
 *
 * The ONLY owner of vertical section rhythm on the site (PRD §12.4). Every page
 * band is a Section; nothing else sets `padding-block` or `margin-block`. This
 * structurally prevents the most common marketing-build bug: competing spacing
 * rules that cancel or double up.
 *
 * Inside a band, the two `--stack-*` tokens continue the same scale:
 * `--stack-lead` separates a SectionHeader from the body it introduces, and
 * `--stack-block` separates sibling blocks within that body. Sections reach for
 * those, never for a raw `--space-*` value — that is what kept the same
 * header-to-body gap at four different sizes across the site.
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

/*
 * TRANSPARENT, not `--bond`. The page ground is a single gradient on <body>
 * (globals.css) and light bands let it through, so consecutive bond sections
 * are one continuous surface with no seam where they meet. Painting `--bond`
 * here would lay a flat swatch back over the drift and restore the hard edge.
 */
.section--bond {
  background-color: transparent;
  color: var(--text-on-bond);
}

/* One rung up the ladder, not a jump to white — enough to lift the band off
   the page ground, not enough to read as a different material. */
.section--bond-raised {
  background-color: var(--cream);
  color: var(--text-on-bond);
}

/*
 * The one hard contrast on the page, so its edges do the work the light bands
 * no longer need to: the top and bottom eighth lift toward the paper either
 * side, which stops the band reading as a black rectangle dropped onto the
 * document. The seal hairline caps it — the transition is stated, not blurred.
 */
.section--ink {
  background-color: var(--ink);
  background-image: linear-gradient(
    180deg,
    color-mix(in srgb, var(--ink) 88%, var(--bond)) 0%,
    var(--ink) 12%,
    var(--ink) 88%,
    color-mix(in srgb, var(--ink) 88%, var(--bond)) 100%
  );
  color: var(--text-on-ink);
}

.section--ink::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--seal) 18%, var(--seal) 82%, transparent);
  pointer-events: none;
}

.section--ink-raised {
  background-color: var(--ink-raised);
  color: var(--text-on-ink);
}
</style>
