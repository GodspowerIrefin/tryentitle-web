<script setup lang="ts">
/**
 * 404 — Not found (PRD FR4). Offers navigation back to home and to booking, and
 * is marked noindex. vite-ssg renders this component to /404.html so the host
 * can serve it with a real 404 status.
 */
import { useHead } from '@unhead/vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Button from '@/components/primitives/Button'
import BookingButton from '@/components/marketing/BookingButton'
import { buildHead } from '@/lib/metadata'

useHead(
  buildHead({
    title: 'Page not found',
    description: 'That page could not be found.',
    path: '/404',
    noindex: true,
  }),
)
</script>

<template>
  <Section>
    <Container>
      <div class="notfound">
        <Eyebrow>Error 404</Eyebrow>
        <Heading :level="1" size="h2">This page isn’t here.</Heading>
        <p class="notfound__body">
          The link may be old or mistyped. Head back home, or book a workflow review and we’ll
          point you the right way.
        </p>
        <div class="notfound__actions">
          <Button to="/" variant="secondary">Back to home</Button>
          <BookingButton placement="not-found" />
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.notfound {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 48ch;
}

.notfound__body {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-lg);
}

.notfound__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
</style>
