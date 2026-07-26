<script setup lang="ts">
/**
 * Home — composes sections only; no markup logic (PRD §11.2).
 *
 * Data is resolved here and passed down as props so every section stays
 * presentational and testable from a fixture (PRD §11.3 rule 3).
 */
import { useHead } from '@unhead/vue'

import Hero from '@/components/sections/Hero'
import PainPoints from '@/components/sections/PainPoints'
import ServicesGrid from '@/components/sections/ServicesGrid'
import IndustriesGrid from '@/components/sections/IndustriesGrid'
import ProcessRail from '@/components/sections/ProcessRail'
import ProofStrip from '@/components/sections/ProofStrip'
import ClosingCta from '@/components/sections/ClosingCta'

import { HOME_COPY } from '@/data/home'
import { PAIN_POINTS } from '@/data/pain-points'
import { SERVICES } from '@/data/services'
import { INDUSTRIES } from '@/data/industries'
import { PROCESS_STEPS } from '@/data/process-steps'
import { TESTIMONIALS } from '@/lib/proof'

import { buildHead, jsonLd } from '@/lib/metadata'
import { organizationSchema } from '@/lib/schema'
import { SITE_TAGLINE } from '@/lib/constants'

useHead({
  ...buildHead({
    title: 'Home',
    description: SITE_TAGLINE,
    path: '/',
    image: '/og/home.png',
  }),
  script: [jsonLd(organizationSchema())],
})
</script>

<template>
  <Hero
    :eyebrow="HOME_COPY.hero.eyebrow"
    :title="HOME_COPY.hero.title"
    :subhead="HOME_COPY.hero.subhead"
    :meta="HOME_COPY.hero.meta"
    :image="HOME_COPY.hero.image"
  />
  <PainPoints
    :eyebrow="HOME_COPY.painPoints.eyebrow"
    :title="HOME_COPY.painPoints.title"
    :intro="HOME_COPY.painPoints.intro"
    :items="PAIN_POINTS"
    :image="HOME_COPY.painPoints.image"
  />
  <ServicesGrid
    :eyebrow="HOME_COPY.services.eyebrow"
    :title="HOME_COPY.services.title"
    :intro="HOME_COPY.services.intro"
    :items="SERVICES"
  />
  <IndustriesGrid
    :eyebrow="HOME_COPY.industries.eyebrow"
    :title="HOME_COPY.industries.title"
    :intro="HOME_COPY.industries.intro"
    :note="HOME_COPY.industries.note"
    :items="INDUSTRIES"
  />
  <ProcessRail
    :eyebrow="HOME_COPY.process.eyebrow"
    :title="HOME_COPY.process.title"
    :intro="HOME_COPY.process.intro"
    :steps="PROCESS_STEPS"
  />
  <ProofStrip :items="TESTIMONIALS" />
  <ClosingCta
    :title="HOME_COPY.closing.title"
    :body="HOME_COPY.closing.body"
    :image="HOME_COPY.closing.image"
  />
</template>
