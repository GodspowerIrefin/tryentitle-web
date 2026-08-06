<script setup lang="ts">
/**
 * Service detail (PRD FR14).
 *
 * Composition:
 *   1. Photo hero — inset paper panel with the name, outcome, and booking CTA
 *   2. Narrative body — summary lead, sticky contents rail, Markdown prose
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

/**
 * Same threshold ArticleLayout uses (PRD §13): a rail is navigation, and a
 * document with two headings does not need navigating.
 */
const showToc = computed(() => (doc.value?.toc.length ?? 0) > 2)

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
      :chips="service.chips ?? []"
      :icon="service.icon"
    />

    <Section tone="bond" id="service-body" aria-label="About this service">
      <Container>
        <div class="body" :class="{ 'body--toc': showToc }">
          <aside v-if="showToc" class="toc" aria-label="On this page">
            <p class="toc__label">On this page</p>
            <ul>
              <li v-for="entry in doc.toc" :key="entry.id" :class="`toc__d${entry.depth}`">
                <a :href="`#${entry.id}`">{{ entry.text }}</a>
              </li>
            </ul>
          </aside>

          <div class="body__main">
            <p class="body__lead">{{ service.summary }}</p>
            <Prose :html="doc.html" />
          </div>
        </div>
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
          :aside="SERVICE_DETAIL_COPY.industries.intro"
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
/* ─── Body: contents rail + prose ────────────────────────────────────── */
.body {
  display: grid;
  gap: var(--space-7);
}

/*
 * The rail only earns a column once there is width for one. Below this the
 * document is a single column and the rail sits above the prose as a plain list
 * — a sticky rail on a narrow screen is a box that follows you down the page
 * covering the thing you are trying to read.
 */
@media (min-width: 1000px) {
  .body--toc {
    grid-template-columns: minmax(0, 14rem) minmax(0, 1fr);
    gap: var(--space-9);
    align-items: start;
  }
}

.body__main {
  min-width: 0;
}

/*
 * The service's one-line promise, set as the lead. It is the same string the
 * services rail and the cards use, so it is the sentence a visitor arrived
 * expecting to see confirmed.
 */
.body__lead {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 400;
  letter-spacing: var(--tracking-display);
  line-height: var(--leading-heading);
  color: var(--text-on-bond);
  max-width: 34ch;
  margin-bottom: var(--space-7);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--rule-on-bond);
  text-wrap: pretty;
}

.toc {
  position: static;
}

@media (min-width: 1000px) {
  .toc {
    position: sticky;
    /* Clear of the sticky header, which is the compact height once scrolled. */
    top: calc(var(--header-height) + var(--space-6));
  }
}

.toc__label {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--rule-on-bond);
  margin-bottom: var(--space-3);
}

.toc ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc a {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-sm);
  line-height: 1.4;
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: var(--space-3);
  margin-left: -2px;
  display: block;
  transition:
    color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}

.toc a:hover {
  color: var(--text-on-bond);
  border-left-color: var(--seal);
}

/* h3s indent under their h2. */
.toc__d3 a {
  padding-left: var(--space-5);
}

/* ─── Related industries ─────────────────────────────────────────────── */
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
