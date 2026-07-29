<script setup lang="ts">
/**
 * Full FAQ page — every question from data/faq.ts, with JSON-LD matching the
 * on-page accordion (design spec §6 SEO).
 */
import { useHead } from '@unhead/vue'
import FaqAccordion from '@/components/sections/FaqAccordion'
import ClosingCta from '@/components/sections/ClosingCta'
import { FAQ_ITEMS } from '@/data/faq'
import { CLOSING } from '@/data/pages'
import { buildHead, jsonLd } from '@/lib/metadata'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

useHead({
  ...buildHead({
    title: 'FAQ',
    description:
      'Answers to the questions teams ask before a workflow review — software, staffing, cost, data, and what happens if you do not move forward.',
    path: '/faq',
    image: '/og/home.png',
  }),
  script: [
    jsonLd(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'FAQ', path: '/faq' },
      ]),
    ),
    jsonLd(faqSchema(FAQ_ITEMS)),
  ],
})
</script>

<template>
  <FaqAccordion
    eyebrow="FAQ"
    title="Questions teams ask before they book."
    :items="FAQ_ITEMS"
  />
  <ClosingCta :title="CLOSING.title" :body="CLOSING.body" placement="faq" />
</template>
