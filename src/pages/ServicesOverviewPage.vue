<script setup lang="ts">
/**
 * Services overview (PRD FR14). Composes the services grid at page-heading level
 * with a closing CTA. Data resolved here and passed down (PRD §11.3 rule 3).
 */
import { useHead } from '@unhead/vue'
import ServicesGrid from '@/components/sections/ServicesGrid'
import ClosingCta from '@/components/sections/ClosingCta'
import { SERVICES } from '@/data/services'
import { SERVICES_PAGE, CLOSING } from '@/data/pages'
import { buildHead, jsonLd } from '@/lib/metadata'
import { breadcrumbSchema } from '@/lib/schema'

useHead({
  ...buildHead({
    title: 'Services',
    description:
      'Workflow redesign and automation across six services — document, customer, and internal operations, with a human on the exceptions.',
    path: '/services',
    image: '/og/services.png',
  }),
  script: [
    jsonLd(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
    ),
  ],
})
</script>

<template>
  <ServicesGrid
    :eyebrow="SERVICES_PAGE.eyebrow"
    :title="SERVICES_PAGE.title"
    :intro="SERVICES_PAGE.intro"
    :items="SERVICES"
    :level="1"
  />
  <ClosingCta :title="CLOSING.title" :body="CLOSING.body" placement="services-overview" />
</template>
