<script setup lang="ts">
/**
 * Services overview — the premium design's "Solutions" page: a numbered list of
 * the six services, then Operations Assessment in focus.
 */
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import BookingButton from '@/components/marketing/BookingButton'
import { SERVICES } from '@/data/services'
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

const SYMPTOMS = [
  'No one can say exactly where a request is once it leaves their desk.',
  'The same task is done a little differently by every person who touches it.',
  'You suspect there is waste, but you cannot point to where the time actually goes.',
]

const DELIVERABLES = [
  'A workflow map showing every handoff, wait, and rekey in the process as it runs today.',
  'A step-by-step recommendation — automate, redesign, or leave alone — with the reason for each.',
  'A rough estimate of the time each change would give back per week.',
]
</script>

<template>
  <section class="intro">
    <h1 class="eyebrow">Solutions</h1>
  </section>

  <section class="rule-top">
    <div class="wrap list">
      <RouterLink
        v-for="(svc, i) in SERVICES"
        :key="svc.slug"
        :to="`/services/${svc.slug}`"
        class="row"
      >
        <span class="row__num">{{ String(i + 1).padStart(2, '0') }}</span>
        <h2 class="row__name">{{ svc.name }}</h2>
        <span class="row__view">View</span>
      </RouterLink>
    </div>
  </section>

  <section class="rule-bottom">
    <div class="wrap focus">
      <div>
        <p class="eyebrow">Service · in focus</p>
        <h2 class="focus__title">Operations Assessment</h2>
        <p class="focus__headline">See what the work actually costs</p>
        <p class="focus__body focus__body--first">
          We follow your operation end to end and show you where the time, the cost, and the
          capacity are going.
        </p>
        <p class="focus__body">
          Before anything gets automated, we watch how the work actually happens — not how the
          process doc says it happens. The assessment is a short, focused engagement that produces a
          map of one or more of your processes and a clear recommendation for each step.
        </p>
        <BookingButton placement="service-hero" :with-icon="false" pill class="focus__cta" />
      </div>

      <div class="panels">
        <div class="panel">
          <h3 class="panel__title">The symptoms it addresses</h3>
          <ul class="panel__list">
            <li v-for="item in SYMPTOMS" :key="item">— {{ item }}</li>
          </ul>
        </div>
        <div class="panel">
          <h3 class="panel__title">What we deliver</h3>
          <ul class="panel__list">
            <li v-for="item in DELIVERABLES" :key="item">— {{ item }}</li>
          </ul>
        </div>
        <div class="panel panel--ink">
          <h3 class="panel__title panel__title--ink">Where a human stays in the loop</h3>
          <p class="panel__ink-body">
            The assessment is a conversation, not an audit dropped on your desk. You confirm the map
            is accurate and decide which recommendations are worth pursuing. Nothing in your systems
            is changed during this step.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap {
  max-width: 1240px;
  margin: 0 auto;
}

.rule-top {
  border-top: 1px solid var(--stone-200);
}

.rule-bottom {
  border-bottom: 1px solid var(--stone-200);
}

h1,
h2,
h3 {
  font-variation-settings: normal;
  line-height: normal;
  text-wrap: pretty;
}

.intro {
  max-width: 1240px;
  margin: 0 auto;
  padding: 96px 32px 64px;
}

.eyebrow {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--stone-600);
}

.list {
  padding: 0 32px;
}

.row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 28px;
  align-items: center;
  padding: 34px 8px;
  border-bottom: 1px solid var(--stone-200);
  color: var(--charcoal);
  text-decoration: none;
}

.row:hover {
  background: var(--stone-50);
}

.row__num {
  font-size: 12px;
  /* --stone-600, not the design's #94918B: that measured 3.1:1 and fails AA. */
  color: var(--stone-600);
}

.row__name {
  font-family: var(--font-display);
  font-size: clamp(26px, 2.8vw, 38px);
  font-weight: 400;
  letter-spacing: -0.025em;
}

.row__view {
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--orange-text);
  text-align: right;
}

.focus {
  padding: 96px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr));
  gap: 72px;
}

.focus__title {
  font-weight: 300;
  font-size: clamp(32px, 3.6vw, 50px);
  line-height: 1.05;
  letter-spacing: -0.028em;
  margin-top: 22px;
}

.focus__headline {
  font-size: 19px;
  line-height: 1.5;
  color: var(--stone-700);
  margin-top: 18px;
}

.focus__body {
  font-size: 16.5px;
  line-height: 1.62;
  color: var(--stone-800);
  margin-top: 16px;
}

.focus__body--first {
  margin-top: 26px;
}

.focus__cta {
  margin-top: 34px;
}

.panels {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.panel {
  background: var(--stone-50);
  border: 1px solid var(--stone-200);
  padding: 30px 32px;
}

.panel--ink {
  background: var(--charcoal);
  border-color: var(--charcoal);
  color: var(--paper);
}

.panel__title {
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--orange-text-strong);
  font-weight: 600;
}

.panel__title--ink {
  color: var(--peach);
}

.panel__list {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel__list li {
  font-size: 16px;
  line-height: 1.55;
  color: var(--stone-800);
  padding-left: 18px;
  text-indent: -18px;
}

.panel__ink-body {
  font-size: 16px;
  line-height: 1.6;
  color: var(--stone-100);
  margin-top: 16px;
}

@media (max-width: 640px) {
  .intro {
    padding: 64px 20px 40px;
  }
  .list {
    padding: 0 20px;
  }
  .row {
    grid-template-columns: 28px minmax(0, 1fr) auto;
    gap: 14px;
    padding: 26px 0;
  }
  .focus {
    padding: 72px 20px;
    gap: 48px;
  }
  .panel {
    padding: 24px 22px;
  }
}
</style>
