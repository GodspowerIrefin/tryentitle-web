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
    <Container>
      <div class="closing" data-reveal>
        <Heading id="closing-title" :level="2" size="h1" class="closing__title">
          {{ title }}
        </Heading>
        <p class="closing__body">{{ body }}</p>

        <div class="closing__action">
          <BookingButton :placement="placement" size="lg" />
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
