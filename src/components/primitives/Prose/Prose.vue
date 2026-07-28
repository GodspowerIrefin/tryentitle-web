<script setup lang="ts">
/**
 * Prose
 *
 * Long-form typography for rendered Markdown/MDX (blog posts, legal documents,
 * service and industry detail bodies). This is the ONLY place descendant element
 * selectors are permitted, and they are scoped to this component's output
 * (PRD §12.4).
 *
 * Content may be provided two ways:
 * - `html` prop: a trusted, build-time-rendered HTML string (our content layer).
 * - default slot: authored Vue markup.
 *
 * The measure is capped at 68ch for readability (PRD §10.4).
 *
 * @example <Prose :html="post.html" />
 */
defineProps<{ html?: string }>()
</script>

<template>
  <div class="prose">
    <div v-if="html" v-html="html" />
    <slot v-else />
  </div>
</template>

<style scoped>
.prose {
  max-width: var(--measure);
  color: var(--text-on-bond);
  font-size: var(--text-body-lg);
  line-height: var(--leading-body);
}

/* Content is injected via v-html, so target it with :deep(). */
/* h2 takes the display face; Bricolage is variable so 600 is a real weight here,
   not a synthesised one. h3 drops to the body face per spec §1 (display is
   H1–H2 only), and the family change carries the hierarchy. */
.prose :deep(h2) {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  line-height: var(--leading-heading);
  letter-spacing: var(--tracking-display);
  margin-block: var(--space-7) var(--space-3);
}

.prose :deep(h3) {
  font-family: var(--font-body);
  font-size: var(--text-h3);
  font-weight: 600;
  margin-block: var(--space-6) var(--space-2);
}

.prose :deep(p),
.prose :deep(ul),
.prose :deep(ol),
.prose :deep(blockquote),
.prose :deep(pre) {
  margin-block: var(--space-4);
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-inline-start: var(--space-5);
}

.prose :deep(ul) {
  list-style: none;
}

.prose :deep(ul > li) {
  position: relative;
  padding-inline-start: var(--space-4);
}

/* Brass tick as the list marker — the exception motif, non-text use (PRD §10.3) */
.prose :deep(ul > li)::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 0.7em;
  width: 6px;
  height: 6px;
  background-color: var(--seal);
}

.prose :deep(ol) {
  list-style: decimal;
}

.prose :deep(li) {
  margin-block: var(--space-2);
}

.prose :deep(a) {
  color: var(--text-on-bond);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose :deep(a:hover) {
  color: var(--text-on-bond);
}

.prose :deep(blockquote) {
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--seal);
  color: var(--text-on-bond-muted);
  font-style: normal;
}

.prose :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background-color: var(--seal-wash);
  padding: 0.1em 0.35em;
  border-radius: var(--radius-chip);
}

.prose :deep(pre) {
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  background-color: var(--ink);
  color: var(--text-on-ink);
  padding: var(--space-4);
  border-radius: var(--radius-card);
  overflow-x: auto;
}

.prose :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.prose :deep(img) {
  border-radius: var(--radius-card);
  border: 1px solid var(--rule-on-bond);
}

.prose :deep(hr) {
  border: none;
  border-top: 1px solid var(--rule-on-bond);
  margin-block: var(--space-7);
}

/* Heading anchors added by markdown-it-anchor */
.prose :deep(.header-anchor) {
  color: var(--text-on-bond-muted);
  text-decoration: none;
  margin-inline-start: var(--space-2);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-standard);
}

.prose :deep(h2:hover .header-anchor),
.prose :deep(h3:hover .header-anchor),
.prose :deep(.header-anchor:focus-visible) {
  opacity: 1;
}
</style>
