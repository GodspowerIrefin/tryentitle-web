<script setup lang="ts">
/**
 * Service detail (PRD FR14).
 *
 * Composition:
 *   1. Ink hero — icon, outcome headline, chips, booking CTA
 *   2. Narrative body from the Markdown content layer
 *   3. Use-case grid — concrete "show me" situations (data/service-detail.ts)
 *   4. Related industries — cross-links into the field pages
 *   5. Closing CTA
 *
 * Data is resolved here and passed down (PRD §11.3 rule 3).
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'

import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Prose from '@/components/primitives/Prose'
import Icon from '@/components/primitives/Icon'
import ServiceHero from '@/components/sections/ServiceHero'
import UseCaseGrid from '@/components/sections/UseCaseGrid'
import ClosingCta from '@/components/sections/ClosingCta'
import SectionHeader from '@/components/sections/SectionHeader'
import NotFoundPage from '@/pages/NotFoundPage.vue'

import { getServiceContent } from '@/lib/content'
import { getService } from '@/data/services'
import { getServiceDetail } from '@/data/service-detail'
import { INDUSTRIES } from '@/data/industries'
import { CLOSING, SERVICE_DETAIL_COPY } from '@/data/pages'
import { buildHead, jsonLd } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const doc = computed(() => getServiceContent(slug.value))
const service = computed(() => getService(slug.value))
const detail = computed(() => getServiceDetail(slug.value))

const relatedIndustries = computed(() =>
  (detail.value?.industries ?? [])
    .map((s) => INDUSTRIES.find((i) => i.slug === s))
    .filter((i): i is (typeof INDUSTRIES)[number] => Boolean(i)),
)

const head = computed(() => {
  const d = doc.value
  const s = service.value
  if (!d || !s) {
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
  <template v-if="doc && service">
    <ServiceHero
      :breadcrumbs="[
        { label: 'Services', to: '/services' },
        { label: service.name },
      ]"
      eyebrow="Service"
      :title="service.name"
      :headline="service.headline"
      :summary="service.summary"
      :chips="service.chips ?? []"
      :icon="service.icon"
    />

    <Section tone="bond" id="service-body" aria-label="About this service">
      <Container width="content">
        <Prose :html="doc.html" />
      </Container>
    </Section>

    <UseCaseGrid
      v-if="detail?.useCases.length"
      :eyebrow="SERVICE_DETAIL_COPY.useCases.eyebrow"
      :title="SERVICE_DETAIL_COPY.useCases.title"
      :intro="SERVICE_DETAIL_COPY.useCases.intro"
      :items="detail.useCases"
      :problem-label="SERVICE_DETAIL_COPY.useCases.problemLabel"
      :build-label="SERVICE_DETAIL_COPY.useCases.buildLabel"
      :impacts-label="SERVICE_DETAIL_COPY.useCases.impactsLabel"
      tone="bond-raised"
    />

    <Section
      v-if="relatedIndustries.length"
      tone="bond"
      labelledby="related-industries-title"
    >
      <Container>
        <SectionHeader
          :eyebrow="SERVICE_DETAIL_COPY.industries.eyebrow"
          :title="SERVICE_DETAIL_COPY.industries.title"
          title-id="related-industries-title"
          :intro="SERVICE_DETAIL_COPY.industries.intro"
        />
        <ul class="related">
          <li v-for="industry in relatedIndustries" :key="industry.slug">
            <RouterLink :to="`/industries/${industry.slug}`" class="related__link">
              <span class="related__icon" aria-hidden="true">
                <Icon :name="industry.icon" :size="20" />
              </span>
              <span class="related__text">
                <span class="related__name">{{ industry.name }}</span>
                <span class="related__blurb">{{ industry.workflows.join(' · ') }}</span>
              </span>
              <Icon name="arrow-up-right" :size="16" class="related__arrow" />
            </RouterLink>
          </li>
        </ul>
      </Container>
    </Section>

    <ClosingCta :title="CLOSING.title" :body="CLOSING.body" placement="service-detail" />
  </template>
  <NotFoundPage v-else />
</template>

<style scoped>
.related {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 720px) {
  .related {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.related__link {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  height: 100%;
  padding: var(--space-5);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
  background-color: var(--bond-raised);
  color: inherit;
  text-decoration: none;
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.related__link:hover {
  border-color: var(--seal);
  color: inherit;
}

.related__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex: none;
  border-radius: var(--radius-card);
  background-color: var(--seal-wash);
  color: var(--seal-ink);
}

.related__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1 1 auto;
  min-width: 0;
}

.related__name {
  font-weight: 600;
  font-size: var(--text-body);
}

.related__blurb {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-sm);
}

.related__arrow {
  flex: none;
  margin-top: 2px;
  color: var(--text-on-bond-muted);
}
</style>
