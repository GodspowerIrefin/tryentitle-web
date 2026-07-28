<script setup lang="ts">
/**
 * Eyebrow
 *
 * The mono utility label above a heading. This is the site's personality
 * carrier: uppercase IBM Plex Mono at wide tracking makes every label read like
 * a record entry, which is what sells "auditable process" on every screen
 * (design spec §1).
 *
 * Band-aware — seal is legible on ink (6.4:1) but not on bond at this size, so
 * the light band uses the darkened `--seal-ink` (4.95:1).
 *
 * Decorative by default: if the eyebrow is not announced as structure, mark it
 * `aria-hidden` via the caller. When it labels a section, give it an id and wire
 * the Section's aria-labelledby to it.
 *
 * @example <Eyebrow>Where the hours go</Eyebrow>
 */
withDefaults(defineProps<{ as?: string; tone?: 'seal' | 'muted' }>(), {
  as: 'p',
  tone: 'seal',
})
</script>

<template>
  <component :is="as" class="eyebrow mono-label" :class="`eyebrow--${tone}`">
    <slot />
  </component>
</template>

<style scoped>
.eyebrow--seal {
  color: var(--seal-ink);
}

.on-ink .eyebrow--seal {
  color: var(--seal);
}

.eyebrow--muted {
  color: var(--text-on-bond-muted);
}

.on-ink .eyebrow--muted {
  color: var(--text-on-ink-muted);
}
</style>
