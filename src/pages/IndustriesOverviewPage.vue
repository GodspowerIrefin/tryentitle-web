<script setup lang="ts">
/**
 * Industries overview (PRD FR15). The industries grid at page-heading level with
 * the required "not exhaustive" note (FR10) and a closing CTA.
 */
import { useHead } from '@unhead/vue'
import IndustriesGrid from '@/components/sections/IndustriesGrid'
import ClosingCta from '@/components/sections/ClosingCta'
import { INDUSTRIES } from '@/data/industries'
import { INDUSTRIES_PAGE, CLOSING } from '@/data/pages'
import { buildHead, jsonLd } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

useHead({
  ...buildHead({
    title: 'Industries',
    description:
      'Document-heavy operations for healthcare, legal, insurance, accounting, real estate, construction, and professional services.',
    path: '/industries',
    image: '/og/industries.png',
  }),
  script: [
    jsonLd(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Industries', path: '/industries' },
      ]),
    ),
  ],
})
</script>

<template>
  <IndustriesGrid
    :eyebrow="INDUSTRIES_PAGE.eyebrow"
    :title="INDUSTRIES_PAGE.title"
    :intro="INDUSTRIES_PAGE.intro"
    :note="INDUSTRIES_PAGE.note"
    :note-cta="INDUSTRIES_PAGE.noteCta"
    :items="INDUSTRIES"
    :level="1"
  />
  <ClosingCta :title="CLOSING.title" :body="CLOSING.body" placement="industries-overview" />
</template>
