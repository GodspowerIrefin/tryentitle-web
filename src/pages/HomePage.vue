<script setup lang="ts">
/**
 * Home — composes sections only; no markup logic (PRD §11.2).
 *
 * Section order and band alternation follow design spec §3. The bands are the
 * argument: the visitor scrolls from INK (the problem — manual chaos, hidden
 * cost) into BOND (the solution — clean process, clear deliverables), and back to
 * ink for the ask. Reordering these changes the argument, not just the layout.
 *
 *   1  Hero + Live Workflow Strip   bond   comprehension in five seconds
 *   2  Systems marquee              ink    credibility + stack qualification
 *   3  Cost of manual work          ink    agitate the pain, name the leaks
 *   4  Positioning contrast         bond   kill the "generic AI tool" objection
 *   5  Six core services            bond   scope clarity
 *   6  How an engagement runs       bond   de-risk the commitment
 *   7  Human oversight layer        ink    the differentiator
 *   8  Industries marquee           bond   self-identification (all fields)
 *   9  Hours calculator             bond   convert intent into a number
 *  10  Proof commitments            bond   credibility substitute
 *  11  Testimonials                 bond   renders nothing until real (FR12)
 *  12  Field notes                  bond   renders nothing until posts exist
 *  13  FAQ                          bond   clear final objections
 *  14  Closing CTA                  ink    book the call
 *
 * Data is resolved here and passed down as props so every section stays
 * presentational and testable from a fixture (PRD §11.3 rule 3).
 */
import { useHead } from '@unhead/vue'

import Hero from '@/components/sections/Hero'
import SystemsMarquee from '@/components/sections/SystemsMarquee'
import PainPoints from '@/components/sections/PainPoints'
import PositioningContrast from '@/components/sections/PositioningContrast'
import ServicesGrid from '@/components/sections/ServicesGrid'
import ProcessRail from '@/components/sections/ProcessRail'
import OversightLayer from '@/components/sections/OversightLayer'
import IndustriesMarquee from '@/components/sections/IndustriesMarquee'
import HoursCalculator from '@/components/sections/HoursCalculator'
import ProofCommitments from '@/components/sections/ProofCommitments'
import ProofStrip from '@/components/sections/ProofStrip'
import FaqAccordion from '@/components/sections/FaqAccordion'
import ClosingCta from '@/components/sections/ClosingCta'

import { HOME_COPY } from '@/data/home'
import { PAIN_POINTS } from '@/data/pain-points'
import { POSITIONING } from '@/data/positioning'
import { SERVICES } from '@/data/services'
import { PROCESS_STEPS } from '@/data/process-steps'
import { PROOF_COMMITMENTS } from '@/data/proof'
import { HOME_FAQ } from '@/data/faq'
import { TESTIMONIALS } from '@/lib/proof'

import { buildHead, jsonLd } from '@/lib/metadata'
import { faqSchema, organizationSchema } from '@/lib/schema'
import { SITE_TAGLINE } from '@/lib/constants'

/** Concrete exception examples revealed from the oversight bar's gold segment. */
const EXCEPTION_EXAMPLES = [
  'A claim with a diagnosis code the payer has never accepted before.',
  'A client who replies to an intake form with three questions and no answers.',
  'An invoice total that does not match the purchase order, by $40.',
]

useHead({
  ...buildHead({
    title: 'Workflow Automation for Document-Heavy Businesses',
    description: SITE_TAGLINE,
    path: '/',
    image: '/og/home.png',
  }),
  script: [jsonLd(organizationSchema()), jsonLd(faqSchema(HOME_FAQ))],
})
</script>

<template>
  <Hero
    :eyebrow="HOME_COPY.hero.eyebrow"
    :title="HOME_COPY.hero.title"
    :subhead="HOME_COPY.hero.subhead"
  />

  <!-- <SystemsMarquee :label="HOME_COPY.systems.label" /> -->

  <PainPoints
    :eyebrow="HOME_COPY.painPoints.eyebrow"
    :title="HOME_COPY.painPoints.title"
    :intro="HOME_COPY.painPoints.intro"
    :items="PAIN_POINTS"
  />

  <ServicesGrid
    :eyebrow="HOME_COPY.services.eyebrow"
    :title="HOME_COPY.services.title"
    :intro="HOME_COPY.services.intro"
    :items="SERVICES"
  />

  <!-- <ProcessRail
    :eyebrow="HOME_COPY.process.eyebrow"
    :title="HOME_COPY.process.title"
    :steps="PROCESS_STEPS"
  /> -->

  <OversightLayer
    :eyebrow="HOME_COPY.oversight.eyebrow"
    :title="HOME_COPY.oversight.title"
    :body="HOME_COPY.oversight.body"
    :automated-label="HOME_COPY.oversight.automatedLabel"
    :human-label="HOME_COPY.oversight.humanLabel"
    :examples="EXCEPTION_EXAMPLES"
  />

  <IndustriesMarquee
    :eyebrow="HOME_COPY.industries.eyebrow"
    :title="HOME_COPY.industries.title"
    :note="HOME_COPY.industries.note"
    :note-cta="HOME_COPY.industries.noteCta"
  />

  <HoursCalculator
    :eyebrow="HOME_COPY.calculator.eyebrow"
    :title="HOME_COPY.calculator.title"
    :footnote="HOME_COPY.calculator.footnote"
  />

  <ProofCommitments
    :eyebrow="HOME_COPY.proof.eyebrow"
    :title="HOME_COPY.proof.title"
    :items="PROOF_COMMITMENTS"
  />

  <ProofStrip :items="TESTIMONIALS" />

  <FaqAccordion
    :eyebrow="HOME_COPY.faq.eyebrow"
    :title="HOME_COPY.faq.title"
    :items="HOME_FAQ"
    more-href="/faq"
    more-label="See all questions"
  />

  <ClosingCta :title="HOME_COPY.closing.title" :body="HOME_COPY.closing.body" />
</template>
