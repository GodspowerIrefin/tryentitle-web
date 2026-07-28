<script setup lang="ts">
/**
 * BlogList (PRD FR16)
 *
 * Renders a page of blog cards — title, date, reading time, excerpt — newest
 * first, with numbered pagination (10 per page). Presentational: the page slice
 * and page state arrive via props; navigation is emitted, not handled here
 * (PRD §11.3 rule 3).
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Card from '@/components/primitives/Card'
import type { MarkdownDoc, BlogFrontmatter } from '@/types/content'
import { formatDate, isoDate, readingLabel } from '@/lib/format'

const props = defineProps<{
  posts: MarkdownDoc<BlogFrontmatter>[]
  page: number
  perPage: number
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.posts.length / props.perPage)))
const pageItems = computed(() => {
  const start = (props.page - 1) * props.perPage
  return props.posts.slice(start, start + props.perPage)
})
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))
</script>

<template>
  <div>
    <ul class="posts">
      <li v-for="post in pageItems" :key="post.slug">
        <Card :to="`/blog/${post.slug}`" class="post">
          <p class="post__meta">
            <time :datetime="isoDate(post.frontmatter.publishedAt)">
              {{ formatDate(post.frontmatter.publishedAt) }}
            </time>
            <span aria-hidden="true">·</span>
            <span>{{ readingLabel(post.readingMinutes) }}</span>
          </p>
          <h2 class="post__title">{{ post.frontmatter.title }}</h2>
          <p class="post__excerpt">{{ post.frontmatter.description }}</p>
        </Card>
      </li>
    </ul>

    <nav v-if="totalPages > 1" class="pager" aria-label="Blog pages">
      <RouterLink
        v-for="p in pages"
        :key="p"
        :to="p === 1 ? '/blog' : `/blog?page=${p}`"
        class="pager__link"
        :aria-current="p === page ? 'page' : undefined"
        :class="{ 'pager__link--active': p === page }"
      >
        {{ p }}
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.posts {
  display: grid;
  gap: var(--space-4);
}

.post {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.post__meta {
  display: flex;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
}

.post__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 400;
  letter-spacing: var(--tracking-display);
}

.post__excerpt {
  color: var(--text-on-bond-muted);
}

.pager {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-6);
}

.pager__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-chip);
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  color: var(--text-on-bond);
}

.pager__link--active {
  border-color: var(--text-on-bond);
  color: var(--text-on-bond);
}
</style>
