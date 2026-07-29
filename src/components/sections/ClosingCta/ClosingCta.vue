<script setup lang="ts">
/**
 * ClosingCta — Ink band (design spec §4.14, PRD FR13)
 *
 * The final ask. Oversized centred display headline, one sub-paragraph, the seal
 * pill, and an email alternative for the visitor who will not book a slot but
 * will send a message.
 *
 * Distinct copy from the hero, same single booking destination (FR2).
 *
 * The spec calls for an inline Calendly widget here, lazy-loaded on scroll-in.
 * That is deliberately NOT built: PRD NFR8 requires third-party scripts to load
 * on interaction rather than on view, and D1 (the real Calendly URL) is still
 * open. The plain link is the crawlable, no-JS-safe default the PRD specifies as
 * the baseline; swapping in an on-click embed later touches only this component.
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Heading from '@/components/primitives/Heading'
import BookingButton from '@/components/marketing/BookingButton'
import { CONTACT } from '@/lib/constants'

withDefaults(
  defineProps<{
    title: string
    body: string
    placement?: string
  }>(),
  { placement: 'closing' },
)
</script>

<template>
  <Section tone="ink" class="closing-band" labelledby="closing-title">
    <!--
      Parallax backdrop. Decorative only — it carries no information, so it is
      `aria-hidden`, and it is held far enough back that every contrast ratio in
      the band is still measured against flat ink (see the scrim in the styles).

      `data-parallax` drifts it against the scroll; `.parallax-frame` oversizes
      and clips the image so the drift never exposes an edge. Both resolve to a
      static, correctly-positioned image when the motion layer is absent.
    -->
    <div class="closing__backdrop parallax-frame" aria-hidden="true">
      <img
        src="/images/closing-infra.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        data-parallax="0.12"
      />
    </div>

    <Container class="closing__container">
      <div class="closing" data-reveal>
        <Heading id="closing-title" :level="2" size="h1" class="closing__title" data-split-lines>
          {{ title }}
        </Heading>
        <p class="closing__body">{{ body }}</p>

        <div class="closing__action">
          <BookingButton :placement="placement" size="lg" data-magnetic />
        </div>

        <p class="closing__alt">
          Or email us:
          <a :href="`mailto:${CONTACT.general}`">{{ CONTACT.general }}</a>
        </p>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
/*
 * The band clips its own backdrop. Without this the oversized parallax image
 * bleeds past the section edges and, at the bottom of the page, extends the
 * document into a horizontal or vertical overflow (NFR1).
 */
.closing-band {
  overflow: hidden;
  isolation: isolate;
}

.closing__backdrop {
  position: absolute;
  inset: 0;
  z-index: -1;
}

/*
 * Two things hold the contrast: the image is dimmed, and a near-opaque ink scrim
 * sits over it. The scrim is what makes this safe — headline and body copy are
 * effectively still on flat `--ink`, so the band's measured ratios are unchanged
 * from the plain version and no accessibility exemption is needed for the image.
 */
.closing__backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, var(--ink) 88%, transparent);
}

.closing__backdrop img {
  filter: grayscale(1) contrast(1.1);
  opacity: 0.5;
}

/* Establishes the stacking context the negative-z backdrop sits behind. */
.closing__container {
  position: relative;
  z-index: 1;
}

.closing {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

.closing__title {
  max-width: 22ch;
}

.closing__body {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-lg);
  max-width: 58ch;
}

.closing__action {
  margin-top: var(--space-3);
}

.closing__alt {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body);
}
</style>
