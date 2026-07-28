<script setup lang="ts">
/**
 * Service detail (PRD FR14). Each page: what it is, the symptoms it addresses,
 * what TryEntitle delivers, where the human stays in the loop (from the MDX
 * body), and a CTA. Content is resolved from the content layer by slug and
 * passed to the presentational ArticleLayout (PRD §11.3 rule 3).
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import ArticleLayout from '@/components/sections/ArticleLayout'
import ClosingCta from '@/components/sections/ClosingCta'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import { getServiceContent } from '@/lib/content'
import { CLOSING } from '@/data/pages'
import { buildHead, jsonLd } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

const route = useRoute()
const doc = computed(() => getServiceContent(String(route.params.slug)))

const head = computed(() => {
  const d = doc.value
  if (!d) {
    return buildHead({
      title: 'Service not found',
      description: 'That service could not be found.',
      path: route.path,
      noindex: true,
    })
  }
  const path = `/services/${d.slug}`
  return {
    ...buildHead({
      title: d.frontmatter.title,
      description: d.frontmatter.description,
      path,
      image: '/og/services.png',
    }),
    script: [
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: d.frontmatter.title, path },
        ]),
      ),
    ],
  }
})
useHead(head)
</script>

<template>
  <template v-if="doc">
    <ArticleLayout
      :breadcrumbs="[
        { label: 'Services', to: '/services' },
        { label: doc.frontmatter.title },
      ]"
      eyebrow="Service"
      :title="doc.frontmatter.title"
      :lead="doc.frontmatter.description"
      :html="doc.html"
    />
    <ClosingCta :title="CLOSING.title" :body="CLOSING.body" placement="service-detail" />
  </template>
  <NotFoundPage v-else />
</template>
