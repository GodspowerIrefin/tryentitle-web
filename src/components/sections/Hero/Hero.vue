<script setup lang="ts">
/**
 * Hero — Ink band (design spec §4.2, PRD FR7)
 *
 * Comprehension in five seconds. Two columns on desktop: the statement and CTAs
 * on the left, the Live Workflow Strip on the right. The strip is the argument;
 * the copy names it.
 *
 * Presentational — all copy arrives via props (PRD §11.3 rule 4). Copy comes
 * first in the DOM and the CTA sits high, so it stays above the fold at 360×640
 * (FR7).
 */
import { onMounted, ref } from 'vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Button from '@/components/primitives/Button'
import BookingButton from '@/components/marketing/BookingButton'
import WorkflowStrip from '@/components/marketing/WorkflowStrip'
import { splitLines } from '@/lib/motion/split'

defineProps<{
  eyebrow: string
  title: string
  subhead: string
  /** Micro-trust row — short mono claims under the CTAs. */
  meta?: readonly string[]
  secondaryLabel?: string
}>()

/**
 * The hero uses an ON-LOAD entrance, not the site's scroll-reveal system: it is
 * already in view at first paint, so a scroll-triggered reveal would either fire
 * instantly (pointless) or leave the h1 hidden until the visitor scrolled (awful).
 * Set on the next frame so the transition has an initial state to move from.
 */
const revealed = ref(false)
/** The copy column, used to reach the rendered h1 for the line split. */
const copy = ref<HTMLElement | null>(null)

onMounted(() => {
  requestAnimationFrame(() => (revealed.value = true))

  /*
   * The h1 gets the line-mask treatment: split into its real visual lines, each
   * sliding up from behind its own clip. Driven here rather than by the shared
   * reveal observer because the hero is above the fold — a scroll trigger would
   * fire instantly anyway, and the entrance needs to be part of page load.
   *
   * Deferred until `fonts.ready`: line breaks are measured from the rendered
   * text, so splitting in the fallback face and then swapping to Bricolage would
   * break at the wrong words. The h1 is reached through the column rather than
   * a ref on <Heading>, which would hand back a component instance, not a node.
   *
   * If the split does not take — markup it cannot safely reflow, an older
   * browser, reduced motion — the heading is left exactly as authored and still
   * arrives with the cascade below. Nothing here is load-bearing.
   */
  void (document.fonts?.ready ?? Promise.resolve()).then(() => {
    const heading = copy.value?.querySelector('h1')
    if (heading && splitLines(heading)) {
      requestAnimationFrame(() => heading.classList.add('is-split-in'))
    }
  })
})
</script>

<template>
  <Section as="section" tone="ink" class="hero" labelledby="hero-title">
    <Container class="hero__grid">
      <div ref="copy" class="hero__copy" :class="{ 'is-revealed': revealed }">
        <Eyebrow class="hero__step" style="--i: 0">{{ eyebrow }}</Eyebrow>

        <Heading id="hero-title" :level="1" size="h1" class="hero__title hero__step" style="--i: 1">
          {{ title }}
        </Heading>

        <p class="hero__subhead hero__step" style="--i: 2">{{ subhead }}</p>

        <div class="hero__actions hero__step" style="--i: 3">
          <BookingButton placement="hero" size="lg" data-magnetic />
        </div>
        <!-- Micro-trust row. Rendered only when copy supplies it, so the fold
             budget at 360×640 is never spent on an empty rule (FR7). -->
        <ul v-if="meta?.length" class="hero__trust hero__step" style="--i: 4">
          <li v-for="claim in meta" :key="claim">{{ claim }}</li>
        </ul>
      </div>

      <!--
        The strip drifts slightly slower than the page as the hero scrolls away,
        which is what separates it from the copy column and gives the fold depth.
        A small figure on purpose: the strip is a live diagram, not wallpaper, and
        anything past ~0.1 makes it visibly lag the text it belongs to.
      -->
      <div
        class="hero__visual hero__step"
        :class="{ 'is-revealed': revealed }"
        style="--i: 5"
        data-parallax="-0.08"
      >
        <WorkflowStrip />
      </div>
    </Container>

    <!-- Scroll cue. Decorative and duplicated by the scrollbar, so it is hidden
         from assistive tech; it fades out as soon as the visitor starts moving. -->
    <div class="hero__cue" :class="{ 'is-revealed': revealed }" aria-hidden="true">
      <span class="mono-label">Scroll</span>
      <span class="hero__cue-rail"><span class="hero__cue-dot" /></span>
    </div>
  </Section>
</template>

<style scoped>
.hero {
  /* Slightly tighter at the top than a standard band — the header sits over it
     and the fold needs the CTA. */
  padding-block: clamp(2.5rem, 2rem + 4vw, 5rem) var(--section-rhythm);
}

.hero__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: flex-start;
}

/* The measure lives on the headline, never on the flex parent — constraining
   the parent would squeeze the subhead, buttons, and trust row to match. */
.hero__title {
  max-width: 15ch;
}

.hero__subhead {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-lg);
  max-width: 52ch;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.hero__trust {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  align-self: stretch;
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-ink);
}

.hero__trust li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-on-ink-muted);
}

/* Per-item marker rather than dividers between items: a divider on the first
   item of a wrapped second line detaches and reads as a stray mark. */
.hero__trust li::before {
  content: '';
  width: 5px;
  height: 5px;
  flex: none;
  border-radius: var(--radius-pill);
  background-color: var(--seal);
}

.hero__visual {
  margin-top: var(--space-8);
}

/*
 * Scroll cue — a small mono label and a rail with a dot travelling down it.
 *
 * Desktop only: it sits at the bottom of the band, and on a 640px-high viewport
 * that position is either off-screen or competing with the CTA for the fold
 * (FR7). It is also the one looping animation on the page, so it is confined to
 * the hero and stops entirely under reduced motion.
 */
.hero__cue {
  display: none;
}

@media (min-width: 1000px) {
  .hero__cue {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    position: absolute;
    bottom: var(--space-6);
    left: max(var(--gutter), calc(50% - var(--content-max) / 2));
    color: var(--text-on-ink-muted);
  }

  .hero__cue-rail {
    display: block;
    position: relative;
    width: 1px;
    height: 40px;
    background-color: var(--rule-on-ink);
  }

  .hero__cue-dot {
    position: absolute;
    inset-inline-start: -1px;
    top: 0;
    width: 3px;
    height: 8px;
    background-color: var(--seal);
  }
}

@media (min-width: 1000px) and (prefers-reduced-motion: no-preference) {
  /* Enters with the rest of the hero, one beat after the last element. */
  .hero__cue {
    transform: translateY(10px);
    transition: transform var(--duration-slow) var(--ease-standard);
    transition-delay: 420ms;
  }

  .hero__cue.is-revealed {
    transform: translateY(0);
  }

  .hero__cue-dot {
    animation: hero-cue 2.4s var(--ease-standard) infinite;
  }
}

@keyframes hero-cue {
  0% {
    transform: translateY(0);
  }
  /* Holds at the bottom for the back half of the cycle: a dot that runs
     continuously reads as a loading bar, one that drops and rests reads as an
     instruction. */
  45%,
  100% {
    transform: translateY(32px);
  }
}

/* One composed entrance on load: a 10px rise cascading 60ms per element. Nothing
   loops and nothing re-triggers on scroll (spec §5).

   Transform only, no fade — for the same reason as the site-wide reveals: a
   contrast checker reads the blended colour of a fading element and reports the
   h1 and subhead as failures while the entrance runs. */
@media (prefers-reduced-motion: no-preference) {
  .hero__step {
    transform: translateY(10px);
    transition: transform var(--duration-slow) var(--ease-standard);
    transition-delay: calc(var(--i, 0) * 60ms);
  }

  .hero__copy.is-revealed .hero__step,
  .hero__visual.is-revealed {
    transform: translateY(0);
  }
}

@media (min-width: 1000px) {
  .hero__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: clamp(var(--space-6), 4vw, var(--space-9));
    align-items: center;
  }

  .hero__visual {
    margin-top: 0;
  }
}
</style>
