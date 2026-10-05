<script setup lang="ts">
/**
 * Home — built to match the premium design file (TryEntitle.dc.html) exactly:
 *
 *   1  Hero                 Innovative Operations Solutions + booking pill
 *   2  About                About Us / Who We Are / Our Mission
 *   3  How we differ        charcoal band, automated vs human review bar
 *   4  Who this is for      six industry cards
 *   5  Cost calculator      three sliders and the annual estimate
 *   6  Get in touch         intro + contact form
 *   7  FAQ                  three questions
 *
 * Desktop measurements are the design's own; the few media queries at the bottom
 * only stop fixed widths from forcing horizontal scroll on phones.
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'

import BookingButton from '@/components/marketing/BookingButton'
import ServiceScene from '@/components/three/ServiceScene.vue'
import { INDUSTRIES } from '@/data/industries'
import { HOME_FAQ } from '@/data/faq'
import { CONTACT_COPY } from '@/data/contact'
import { buildHead, jsonLd } from '@/lib/metadata'
import { faqSchema, organizationSchema } from '@/lib/schema'
import { CONTACT, HERO_CTA_LABEL, SITE_TAGLINE } from '@/lib/constants'

useHead({
  ...buildHead({
    title: 'Workflow Automation for Document-Heavy Businesses',
    description: SITE_TAGLINE,
    path: '/',
    image: '/og/home.png',
  }),
  script: [jsonLd(organizationSchema()), jsonLd(faqSchema(HOME_FAQ))],
})

const ABOUT = [
  {
    title: 'About Us',
    body: 'TryEntitle helps businesses run better. We improve day-to-day operations, reduce unnecessary costs, and help companies build a stronger foundation for growth.',
  },
  {
    title: 'Who We Are',
    body: 'We work with businesses to find where time, money, and resources are being wasted. We look at how work gets done, identify what is slowing the business down, and help put better processes and systems in place.',
  },
  {
    title: 'Our Mission',
    body: 'Our mission is simple: help businesses operate better and grow without unnecessary complexity. We believe a growing business should become more efficient, not simply become more expensive to run.',
  },
]

// ─── Hero visual ──────────────────────────────────────────────────────────
// The document-plane scene that used to be scroll-driven on /services, now on the
// hero's right side and advancing on its own timer. Under reduced motion the
// scene never initialises (useThreeScene), so the timer is skipped as well.
const FORMATIONS = 6
const FORMATION_MS = 3200
const formation = ref(0)
let formationTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  formationTimer = setInterval(() => {
    formation.value = (formation.value + 1) % FORMATIONS
  }, FORMATION_MS)
})

onBeforeUnmount(() => clearInterval(formationTimer))

/** The six fields shown on home; Professional Services lives on /industries. */
const HOME_INDUSTRIES = INDUSTRIES.filter((i) => i.slug !== 'professional-services')

// ─── Cost calculator ──────────────────────────────────────────────────────
const WEEKS_PER_YEAR = 48
const team = ref(20)
const hours = ref(30)
const rate = ref(27)

const fmt = (n: number) => n.toLocaleString('en-US')
const hoursLost = computed(() => team.value * hours.value * WEEKS_PER_YEAR)
const cost = computed(() => hoursLost.value * rate.value)

const prefill = computed(
  () =>
    `Estimated ${fmt(hoursLost.value)} hours and $${fmt(cost.value)} a year on manual admin ` +
    `(${team.value} people × ${hours.value} hrs/week × ${WEEKS_PER_YEAR} weeks).`,
)

const estimateMail = computed(
  () =>
    `mailto:${CONTACT.general}?subject=${encodeURIComponent('My workflow cost estimate')}` +
    `&body=${encodeURIComponent(
      `Here's the estimate I put together on your site. I'd like to know what you'd do with it.\n\n` +
        `Team Size: ${team.value}\nHours Spent on Admin / Week: ${hours.value}\nAverage Hourly Cost: $${rate.value}\n\n` +
        `${fmt(hoursLost.value)} hours a year\n$${fmt(cost.value)} a year`,
    )}`,
)

// ─── Contact form ─────────────────────────────────────────────────────────
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const form = reactive({ firstName: '', lastName: '', email: '', phone: '', message: '' })
const formError = ref('')
const sent = ref(false)

const contactMail = computed(() => {
  const lines = [
    CONTACT_COPY.mailIntro,
    '',
    form.message.trim() || '(nothing written yet)',
    '',
    `From: ${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
    `Email: ${form.email.trim()}`,
  ]
  if (form.phone.trim()) lines.push(`Phone: ${form.phone.trim()}`)
  return (
    `mailto:${CONTACT.general}?subject=${encodeURIComponent(CONTACT_COPY.mailSubject)}` +
    `&body=${encodeURIComponent(lines.join('\n'))}`
  )
})

function send() {
  sent.value = false
  if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
    formError.value = 'First name, last name and email are needed to reply to you.'
    return
  }
  if (!EMAIL.test(form.email.trim())) {
    formError.value = CONTACT_COPY.errors.email
    return
  }
  formError.value = ''
  sent.value = true
  window.location.href = contactMail.value
}
</script>

<template>
  <!-- ─── Hero ─────────────────────────────────────────────────────────── -->
  <section class="hero">
    <div>
      <h1 class="hero__title">Innovative<br />Operations<br />Solutions</h1>
      <p class="hero__lede">
        We are passionate about creating innovative operation solutions that drive results.
      </p>
      <div class="hero__actions">
        <BookingButton placement="hero" :label="HERO_CTA_LABEL" pill class="hero__cta" />
        <a :href="`mailto:${CONTACT.general}`" class="quiet-link hero__mail">{{
          CONTACT.general
        }}</a>
      </div>
    </div>
    <div class="hero__visual" aria-hidden="true">
      <ServiceScene :active-index="formation" :count="FORMATIONS" />
    </div>
  </section>

  <!-- ─── About ────────────────────────────────────────────────────────── -->
  <section class="rule-top">
    <div class="wrap about">
      <div v-for="item in ABOUT" :key="item.title">
        <h2 class="kicker">{{ item.title }}</h2>
        <p class="about__body">{{ item.body }}</p>
      </div>
    </div>
  </section>

  <!-- ─── How we differ ────────────────────────────────────────────────── -->
  <section class="differ">
    <div class="wrap differ__inner">
      <p class="eyebrow eyebrow--ink">How we differ</p>
      <h2 class="differ__title">Full automation is a promise nobody keeps. We don’t make it.</h2>
      <div class="differ__bar">
        <div class="differ__auto">
          <p class="differ__label differ__label--auto">Automated</p>
          <p class="differ__sub">the repeatable majority</p>
        </div>
        <div class="differ__human">
          <p class="differ__label">Human review</p>
          <p class="differ__sub differ__sub--human">the judgment calls</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ─── Who this is for ──────────────────────────────────────────────── -->
  <section class="rule-bottom">
    <div class="wrap who">
      <div class="who__head">
        <h2 class="who__title">Who this is for</h2>
        <RouterLink to="/industries" class="who__all">All industries</RouterLink>
      </div>
      <div class="who__grid">
        <RouterLink
          v-for="ind in HOME_INDUSTRIES"
          :key="ind.slug"
          :to="`/industries/${ind.slug}`"
          class="who__card"
        >
          <h3 class="who__name">{{ ind.name }}</h3>
          <p class="who__blurb">{{ ind.outcome }}</p>
          <span class="who__more">Learn more</span>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- ─── Cost calculator ──────────────────────────────────────────────── -->
  <section aria-labelledby="calc-title">
    <div class="wrap calc">
      <h2 id="calc-title" class="eyebrow">Cost calculator</h2>
      <div class="calc__grid">
        <div class="calc__controls">
          <div>
            <div class="calc__row">
              <label for="calc-team" class="calc__label">Team Size</label>
              <span class="calc__value" aria-hidden="true">{{ team }}</span>
            </div>
            <input
              id="calc-team"
              v-model.number="team"
              type="range"
              min="1"
              max="250"
              class="calc__range"
              :aria-valuetext="`${team} people`"
            />
          </div>
          <div>
            <div class="calc__row">
              <label for="calc-hours" class="calc__label">Hours Spent on Admin / Week</label>
              <span class="calc__value" aria-hidden="true">{{ hours }}</span>
            </div>
            <input
              id="calc-hours"
              v-model.number="hours"
              type="range"
              min="1"
              max="40"
              class="calc__range"
              :aria-valuetext="`${hours} hours a week`"
            />
          </div>
          <div>
            <div class="calc__row">
              <label for="calc-rate" class="calc__label">Average Hourly Cost</label>
              <span class="calc__value" aria-hidden="true">${{ rate }}</span>
            </div>
            <input
              id="calc-rate"
              v-model.number="rate"
              type="range"
              min="10"
              max="150"
              class="calc__range"
              :aria-valuetext="`${rate} dollars an hour`"
            />
          </div>
        </div>

        <div class="calc__result" aria-live="polite">
          <p class="eyebrow calc__based">Based on your numbers</p>
          <div class="calc__figures">
            <div>
              <p class="calc__figure">{{ fmt(hoursLost) }}</p>
              <p class="calc__caption">hours lost per year</p>
            </div>
            <div class="calc__divider"></div>
            <div>
              <p class="calc__figure calc__figure--accent">${{ fmt(cost) }}</p>
              <p class="calc__caption">before errors and delays</p>
            </div>
          </div>
          <div class="calc__actions">
            <BookingButton placement="calculator" :prefill="prefill" pill />
            <a :href="estimateMail" class="quiet-link calc__mail">Email me this estimate</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ─── Get in touch ─────────────────────────────────────────────────── -->
  <section id="contact" class="contact">
    <div>
      <h2 class="contact__title">Get In Touch with us today</h2>
      <p class="contact__lede">
        Tell us which process is costing you the most time and we will tell you whether it is worth
        automating.
      </p>
      <div class="contact__direct">
        <p class="contact__direct-label">Or write to us directly</p>
        <a :href="`mailto:${CONTACT.general}`" class="contact__mail">{{ CONTACT.general }}</a>
      </div>
      <div class="contact__book">
        <BookingButton placement="contact" pill />
      </div>
    </div>

    <form class="contact__form" novalidate @submit.prevent="send">
      <div class="contact__grid">
        <label class="field">
          First name *
          <input
            v-model="form.firstName"
            type="text"
            autocomplete="given-name"
            aria-required="true"
            class="field__input"
          />
        </label>
        <label class="field">
          Last name *
          <input
            v-model="form.lastName"
            type="text"
            autocomplete="family-name"
            aria-required="true"
            class="field__input"
          />
        </label>
        <label class="field">
          Email *
          <input
            v-model="form.email"
            type="email"
            autocomplete="email"
            aria-required="true"
            class="field__input"
          />
        </label>
        <label class="field">
          Phone
          <input v-model="form.phone" type="tel" autocomplete="tel" class="field__input" />
        </label>
      </div>
      <label class="field field--message">
        Write a message
        <textarea v-model="form.message" rows="4" class="field__area"></textarea>
      </label>
      <p v-if="formError" class="contact__error" role="alert">{{ formError }}</p>
      <button type="submit" class="contact__send">
        {{ sent ? 'Message sent' : 'Send message' }}
      </button>
    </form>
  </section>

  <!-- ─── FAQ ──────────────────────────────────────────────────────────── -->
  <section class="rule-top">
    <div class="wrap faq">
      <div>
        <h2 class="faq__title">Frequently asked questions</h2>
        <RouterLink to="/faq" class="quiet-link faq__all">See all questions</RouterLink>
      </div>
      <div>
        <div v-for="item in HOME_FAQ" :key="item.question" class="faq__item">
          <h3 class="faq__q">{{ item.question }}</h3>
          <p class="faq__a">{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Shared ─────────────────────────────────────────────────────────── */
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

.eyebrow {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--stone-600);
}

.eyebrow--ink {
  color: var(--stone-450);
}

.kicker {
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--orange-text);
  font-weight: 600;
  margin-bottom: 14px;
}

.quiet-link {
  color: var(--stone-700);
  border-bottom: 1px solid var(--stone-300);
  padding-bottom: 2px;
  text-decoration: none;
}

.quiet-link:hover {
  color: var(--charcoal);
}

/* ─── Hero ───────────────────────────────────────────────────────────── */
.hero {
  max-width: 1240px;
  margin: 0 auto;
  padding: 104px 32px 88px;
}

/* The visual is desktop-only: on phones it would push the CTA below the fold. */
.hero__visual {
  display: none;
}

@media (min-width: 960px) {
  .hero {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 48px;
    align-items: center;
  }

  .hero__visual {
    display: block;
    position: relative;
    height: 440px;
  }
}

.hero__title {
  /* 600, the weight the site's other headings carry. The hero had been set at
     300, which left the first thing a visitor reads lighter than the section
     headings under it. */
  font-weight: 600;
  font-size: clamp(46px, 5.6vw, 82px);
  line-height: 0.98;
  letter-spacing: -0.028em;
}

.hero__lede {
  margin-top: 30px;
  max-width: 100%;
  font-size: 18.5px;
  line-height: 1.55;
  color: var(--stone-700);
}

@media (min-width: 860px) {
  .hero__lede {
    white-space: nowrap;
  }
}

.hero__actions {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.hero__cta {
  padding: 15px 30px;
  font-size: 16px;
}

.hero__mail {
  font-size: 15px;
}

/* ─── About ──────────────────────────────────────────────────────────── */
.about {
  padding: 80px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.about__body {
  font-size: 16.5px;
  line-height: 1.62;
  color: var(--stone-800);
}

/* ─── How we differ ──────────────────────────────────────────────────── */
.differ {
  background: var(--charcoal);
  color: var(--paper);
}

.differ__inner {
  padding: 112px 32px;
}

.differ__title {
  font-weight: 300;
  font-size: clamp(32px, 4.2vw, 58px);
  line-height: 1.06;
  letter-spacing: -0.028em;
  max-width: 22ch;
  margin-top: 26px;
}

.differ__bar {
  margin-top: 64px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 238px;
}

.differ__auto,
.differ__human {
  padding: 26px 28px;
  height: 106px;
}

.differ__auto {
  background: var(--paper);
  color: var(--charcoal);
}

.differ__human {
  background: var(--orange-text);
  color: var(--paper);
}

.differ__label {
  font-size: 30px;
  letter-spacing: -0.02em;
}

/* The design pins this box to 23px, so the caption tucks up under the word. */
.differ__label--auto {
  width: 317px;
  height: 23px;
}

.differ__sub {
  font-size: 15px;
  color: var(--stone-700);
  margin-top: 6px;
}

.differ__sub--human {
  color: var(--paper);
}

/* ─── Who this is for ────────────────────────────────────────────────── */
.who {
  padding: 96px 32px;
}

.who__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.who__title {
  font-weight: 300;
  font-size: clamp(30px, 3.4vw, 46px);
  letter-spacing: -0.025em;
}

.who__all {
  font-size: 14.5px;
  color: var(--orange-text);
  border-bottom: 1px solid var(--stone-300);
  padding-bottom: 2px;
  text-decoration: none;
}

.who__all:hover {
  color: var(--charcoal);
}

.who__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1px;
  background: var(--stone-200);
  border: 1px solid var(--stone-200);
}

.who__card {
  background: var(--paper);
  padding: 32px 30px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 236px;
  color: var(--charcoal);
  text-decoration: none;
}

.who__card:hover {
  background: var(--stone-50);
}

.who__name {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.who__blurb {
  font-size: 15px;
  line-height: 1.58;
  color: var(--stone-650);
  flex: 1;
}

.who__more {
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--orange-text);
}

/* ─── Calculator ─────────────────────────────────────────────────────── */
.calc {
  padding: 100px 32px;
}

.calc__grid {
  margin-top: 34px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  gap: 56px;
  align-items: start;
}

.calc__controls {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.calc__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}

.calc__label {
  font-size: 14.5px;
  color: var(--stone-800);
}

.calc__value {
  font-size: 26px;
}

.calc__range {
  width: 100%;
  margin-top: 12px;
  accent-color: var(--orange);
}

.calc__result {
  border: 1px solid var(--stone-200);
  background: var(--stone-50);
  padding: 38px 34px;
}

.calc__based {
  font-size: 10.5px;
  letter-spacing: 0.08em;
}

.calc__figures {
  margin-top: 26px;
}

.calc__figure {
  font-size: clamp(40px, 4.6vw, 62px);
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.calc__figure--accent {
  color: var(--orange-text);
}

.calc__caption {
  font-size: 14.5px;
  color: var(--stone-600);
  margin-top: 8px;
}

.calc__divider {
  height: 1px;
  background: var(--stone-200);
  margin: 26px 0;
}

.calc__actions {
  margin-top: 34px;
  display: flex;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
}

.calc__mail {
  font-size: 14.5px;
}

/* ─── Contact ────────────────────────────────────────────────────────── */
.contact {
  max-width: 1240px;
  margin: 0 auto;
  padding: 96px 32px;
  border-top: 1px solid var(--stone-200);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(330px, 100%), 1fr));
  gap: 80px;
  align-items: start;
}

.contact__title {
  font-weight: 300;
  font-size: clamp(36px, 4.4vw, 58px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  margin-top: 24px;
}

.contact__lede {
  font-size: 18.5px;
  line-height: 1.55;
  color: var(--stone-700);
  margin-top: 26px;
  max-width: 44ch;
}

.contact__direct {
  margin-top: 44px;
  padding-top: 26px;
  border-top: 1px solid var(--stone-200);
}

.contact__direct-label {
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--stone-600);
}

.contact__mail {
  display: inline-block;
  margin-top: 12px;
  font-size: 26px;
  letter-spacing: -0.02em;
  color: var(--orange-text);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.contact__mail:hover {
  color: var(--charcoal);
}

.contact__book {
  margin-top: 36px;
}

.contact__form {
  border: 1px solid var(--stone-200);
  background: var(--stone-50);
  padding: 40px 38px;
}

.contact__grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--stone-600);
}

.field--message {
  margin-top: 24px;
}

.field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-bottom: 1px solid var(--stone-300);
  border-radius: 0;
  background: transparent;
  padding: 9px 0;
  font-size: 16px;
  letter-spacing: normal;
  text-transform: none;
  color: var(--charcoal);
  outline: none;
}

.field__input:focus {
  border-bottom: 1px solid var(--orange);
}

.field__area {
  border: 1px solid var(--stone-200);
  border-radius: 0;
  background: var(--paper);
  padding: 12px;
  font-size: 16px;
  letter-spacing: normal;
  text-transform: none;
  color: var(--charcoal);
  outline: none;
  resize: vertical;
}

.field__area:focus {
  border: 1px solid var(--orange);
}

.contact__error {
  margin-top: 16px;
  font-size: 15px;
  color: var(--orange-text);
}

.contact__send {
  margin-top: 28px;
  width: 100%;
  background: var(--orange);
  color: var(--black);
  border: none;
  padding: 15px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.contact__send:hover {
  background: var(--charcoal);
  color: var(--paper);
}

/* ─── FAQ ────────────────────────────────────────────────────────────── */
.faq {
  padding: 96px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 64px;
}

.faq__title {
  font-weight: 300;
  font-size: 38px;
  line-height: 1.08;
  letter-spacing: -0.025em;
}

.faq__all {
  display: inline-block;
  margin-top: 20px;
  font-size: 14.5px;
  color: var(--orange-text);
}

.faq__item {
  border-top: 1px solid var(--stone-200);
  padding: 26px 0;
}

.faq__item:last-child {
  border-bottom: 1px solid var(--stone-200);
}

.faq__q {
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.faq__a {
  font-size: 16.5px;
  line-height: 1.6;
  color: var(--stone-650);
  margin-top: 10px;
}

/* ─── Phones: keep the design, lose the sideways scroll ──────────────── */
@media (max-width: 640px) {
  .hero {
    padding: 64px 20px 64px;
  }
  .about,
  .differ__inner,
  .who,
  .calc,
  .faq {
    padding-inline: 20px;
  }
  .differ__inner,
  .who,
  .calc,
  .faq {
    padding-block: 72px;
  }
  .contact {
    padding: 72px 20px;
    gap: 56px;
  }
  .differ__bar {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  }
  .differ__auto,
  .differ__human {
    height: auto;
    padding: 20px 16px;
  }
  .differ__label {
    font-size: 20px;
    line-height: 1.15;
  }
  .differ__sub {
    font-size: 13px;
    line-height: 1.35;
  }
  .differ__label--auto {
    width: auto;
    height: auto;
  }
  .contact__form,
  .calc__result {
    padding: 28px 22px;
  }
  .contact__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
