<script setup lang="ts">
/**
 * ArticleLayout
 *
 * Shared reading layout for every long-form detail page — services, industries,
 * blog posts, and legal documents. Renders a breadcrumb, a page header (eyebrow,
 * h1, lead), an optional table of contents, and the rendered document in Prose.
 *
 * Presentational: all content arrives via props (PRD §11.3 rule 3). The `meta`
 * slot carries page-specific chrome (e.g. a blog date/reading-time line).
 *
 * A table of contents renders only when `toc` has more than two entries — short
 * documents do not need one (PRD §13 threshold).
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Prose from '@/components/primitives/Prose'
import type { TocEntry } from '@/types/content'

interface Crumb {
  label: string
  to?: string
}

const props = withDefaults(
  defineProps<{
    breadcrumbs: Crumb[]
    eyebrow: string
    title: string
    lead?: string
    html: string
    toc?: TocEntry[]
  }>(),
  { toc: () => [] },
)

const showToc = computed(() => props.toc.length > 2)
</script>

<template>
  <Section labelledby="article-title">
    <Container>
      <div class="article-top">
        <nav class="crumbs" aria-label="Breadcrumb">
          <ol>
            <li v-for="(crumb, i) in breadcrumbs" :key="i">
              <RouterLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</RouterLink>
              <span v-else aria-current="page">{{ crumb.label }}</span>
            </li>
          </ol>
        </nav>

        <header class="article-head">
          <Eyebrow>{{ eyebrow }}</Eyebrow>
          <Heading id="article-title" :level="1" size="h2">{{ title }}</Heading>
          <p v-if="lead" class="article-head__lead">{{ lead }}</p>
          <div class="article-head__meta">
            <slot name="meta" />
          </div>
        </header>
      </div>

      <div class="article-body" :class="{ 'article-body--toc': showToc }">
        <aside v-if="showToc" class="toc" aria-label="On this page">
          <p class="toc__label">On this page</p>
          <ul>
            <li v-for="entry in toc" :key="entry.id" :class="`toc__d${entry.depth}`">
              <a :href="`#${entry.id}`">{{ entry.text }}</a>
            </li>
          </ul>
        </aside>

        <Prose :html="html" />
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.article-top {
  position: relative;
  isolation: isolate;
}

.article-top > .crumbs,
.article-top > .article-head {
  position: relative;
  z-index: 1;
}

.crumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
}

.crumbs li:not(:last-child)::after {
  content: '/';
  margin-inline-start: var(--space-2);
  color: var(--rule-on-bond);
}

.crumbs a {
  color: var(--text-on-bond-muted);
}

.crumbs a:hover {
  color: var(--text-on-bond);
}

.article-head {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: var(--measure);
  margin-top: var(--space-5);
}

.article-head__lead {
  font-size: var(--text-body-lg);
  color: var(--text-on-bond-muted);
}

.article-head__meta:empty {
  display: none;
}

.article-body {
  margin-top: var(--space-8);
}

@media (min-width: 960px) {
  .article-body--toc {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: var(--space-8);
    align-items: start;
  }
}

.toc {
  position: sticky;
  top: calc(var(--header-height) + var(--space-4));
}

.toc__label {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
  margin-bottom: var(--space-3);
}

.toc ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-inline-start: 1px solid var(--rule-on-bond);
}

.toc li {
  padding-inline-start: var(--space-3);
}

.toc__d3 {
  padding-inline-start: var(--space-5);
}

.toc a {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-sm);
}

.toc a:hover {
  color: var(--text-on-bond);
}
</style>
