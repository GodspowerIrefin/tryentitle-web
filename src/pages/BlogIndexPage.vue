<script setup lang="ts">
/**
 * Blog index (PRD FR16, FR18).
 *
 * Paginated at 10 posts per page, newest first. With zero published posts it
 * renders an honest empty state — it does not 404 and it never shows fake posts.
 * The route stays linked from the header and footer either way.
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import BlogList from '@/components/sections/BlogList'
import BookingButton from '@/components/marketing/BookingButton'
import { blogPosts } from '@/lib/content'
import { buildHead } from '@/lib/metadata'

const PER_PAGE = 10

const route = useRoute()
const page = computed(() => {
  const n = Number(route.query.page ?? 1)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
})

const hasPosts = computed(() => blogPosts.length > 0)

useHead(
  buildHead({
    title: 'Blog',
    description:
      'Notes on operations, document workflows, and where automation helps — and where it does not.',
    path: '/blog',
    image: '/og/blog.png',
  }),
)
</script>

<template>
  <Section labelledby="blog-title">
    <Container>
      <Eyebrow>Blog</Eyebrow>
      <Heading id="blog-title" :level="1" size="display-lg">
        Notes on how work actually moves.
      </Heading>

      <div v-if="hasPosts" class="blog__list">
        <BlogList :posts="blogPosts" :page="page" :per-page="PER_PAGE" />
      </div>

      <!-- Honest empty state (FR18): no fake posts, no skeleton cards. -->
      <div v-else class="blog__empty">
        <p class="blog__empty-lead">We haven’t published anything here yet.</p>
        <p class="blog__empty-body">
          When we do, it will be specific — how a particular document workflow gets rebuilt, what
          it costs, and what stays with a person. Until then, the fastest way to get something
          useful is a conversation about your own workflow.
        </p>
        <BookingButton placement="blog-empty" />
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.blog__list {
  margin-top: var(--space-8);
}

.blog__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-subtle);
  max-width: var(--measure);
}

.blog__empty-lead {
  font-size: var(--text-body-lg);
  color: var(--text-primary);
}

.blog__empty-body {
  color: var(--text-secondary);
}
</style>
