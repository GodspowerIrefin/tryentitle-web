<script setup lang="ts">
/**
 * Container
 *
 * Horizontal layout primitive. Centres content, applies the responsive gutters
 * (20px mobile / 32px desktop, PRD §10.5), and caps width at the content
 * measure. It owns NO vertical spacing — that is `Section`'s job (PRD §12.4).
 *
 * @example <Container><h1>…</h1></Container>
 */
withDefaults(
  defineProps<{
    /** `content` = 1200px reading width (default). `page` = 1440px full width. */
    width?: 'content' | 'page'
    /** Render as something other than a plain div (e.g. "header", "nav"). */
    as?: string
  }>(),
  { width: 'content', as: 'div' },
)
</script>

<template>
  <component :is="as" class="container" :class="`container--${width}`">
    <slot />
  </component>
</template>

<style scoped>
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.container--content {
  max-width: calc(var(--content-max) + var(--gutter) * 2);
}

.container--page {
  max-width: var(--page-max);
}

@media (min-width: 768px) {
  .container {
    padding-inline: 32px;
  }
}
</style>
