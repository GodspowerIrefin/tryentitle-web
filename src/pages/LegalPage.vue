<script setup lang="ts">
/**
 * Legal document page (PRD FR20/FR21, §13).
 *
 * All four legal documents — Privacy Policy, Terms of Service, Security, DPA —
 * render through this one long-form template with a "Last updated" date, a table
 * of contents for longer documents, and Prose typography.
 *
 * FR21 gate: a document whose frontmatter is not `reviewed: true` renders a
 * prominent draft warning and is marked noindex, so unreviewed legal text cannot
 * quietly ship as though it were final. Flip the flag only after counsel (or a
 * licensed template) has reviewed the document.
 */
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import ArticleLayout from '@/components/sections/ArticleLayout'
import { getLegalContent } from '@/lib/content'
import { buildHead } from '@/lib/metadata'
import { formatDate, isoDate } from '@/lib/format'

const props = defineProps<{ slug: string }>()

const doc = computed(() => getLegalContent(props.slug))
const reviewed = computed(() => doc.value?.frontmatter.reviewed === true)

const head = computed(() => {
  const d = doc.value
  if (!d) {
    return buildHead({
      title: 'Document not found',
      description: 'That document could not be found.',
      path: `/${props.slug}`,
      noindex: true,
    })
  }
  return buildHead({
    title: d.frontmatter.title,
    description: d.frontmatter.description,
    path: `/${d.slug}`,
    image: '/og/legal.png',
    // Unreviewed legal text is never indexable (FR21).
    noindex: !reviewed.value,
  })
})
useHead(head)
</script>

<template>
  <template v-if="doc">
    <ArticleLayout
      :breadcrumbs="[{ label: 'Legal' }, { label: doc.frontmatter.title }]"
      eyebrow="Legal"
      :title="doc.frontmatter.title"
      :html="doc.html"
      :toc="doc.toc"
    >
      <template #meta>
        <p class="legal-meta">
          Last updated
          <time :datetime="isoDate(doc.frontmatter.updatedAt)">
            {{ formatDate(doc.frontmatter.updatedAt) }}
          </time>
        </p>
        <!-- FR21 launch gate — must be resolved before this page goes live. -->
        <div v-if="!reviewed" class="legal-draft" role="note">
          <p class="legal-draft__title">Unreviewed draft — not legally binding</p>
          <p>
            This document is a structural scaffold, not finished legal text. It has not been
            reviewed by counsel and must not be relied on. It is excluded from search indexing
            until it is reviewed.
          </p>
        </div>
      </template>
    </ArticleLayout>
  </template>
</template>

<style scoped>
.legal-meta {
  font-family: var(--font-mono);
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-tertiary);
}

/* The exception accent: this page needs a human before it ships (PRD §10.3). */
.legal-draft {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background-color: var(--accent-exception-bg);
  border-inline-start: 2px solid var(--accent-exception);
  border-radius: var(--radius-sm);
  color: var(--accent-exception-text);
  font-size: var(--text-body-sm);
  max-width: var(--measure);
}

.legal-draft__title {
  font-weight: 600;
  margin-bottom: var(--space-1);
}
</style>
