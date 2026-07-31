<script setup lang="ts">
/**
 * SiteFooter
 *
 * Site chrome present on every page (PRD §6.1). One of exactly two dark bands on
 * the site (the other is the closing CTA), so the shift to ink reads as
 * punctuation (PRD §10.3). Link groups — Solutions, Industries, Company, Legal —
 * are derived from the canonical data model, so the footer can never drift from
 * the source of truth.
 *
 * Owns its own chrome spacing; it is not a page `Section` (PRD §12.4 concerns
 * page content bands, not header/footer chrome).
 */
import { RouterLink } from 'vue-router'
import Container from '@/components/primitives/Container'
import Logo from '@/components/layout/Logo'
import BookingButton from '@/components/marketing/BookingButton'
import { FOOTER_GROUPS } from '@/data/navigation'
import { SITE_TAGLINE } from '@/lib/constants'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <Container>
      <div class="footer__top">
        <div class="footer__brand">
          <RouterLink to="/" class="footer__logo" aria-label="TryEntitle — home">
            <Logo tone="inverse" />
          </RouterLink>
          <p class="footer__tagline">{{ SITE_TAGLINE }}</p>
          <BookingButton placement="footer" variant="primary" />
        </div>

        <nav class="footer__nav" aria-label="Footer">
          <div v-for="group in FOOTER_GROUPS" :key="group.heading" class="footer__group">
            <h2 class="footer__heading">{{ group.heading }}</h2>
            <ul class="footer__links">
              <li v-for="link in group.links" :key="link.to">
                <a v-if="link.external" :href="link.to" class="footer__link">{{ link.label }}</a>
                <RouterLink v-else :to="link.to" class="footer__link">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="footer__bottom">
        <p>© {{ year }} TryEntitle. All rights reserved.</p>
      </div>
    </Container>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--ink);
  color: var(--text-on-ink);
  padding-block: clamp(3rem, 6vw, 5rem);
}

.footer__top {
  display: grid;
  gap: var(--space-8);
}

@media (min-width: 900px) {
  .footer__top {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  }
}

.footer__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  max-width: 30ch;
}

/* The wordmark is not running text — the global link underline does not
   belong on it. */
.footer__logo {
  display: inline-flex;
  text-decoration: none;
}

.footer__tagline {
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-sm);
  line-height: 1.5;
}

.footer__nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
}

@media (min-width: 640px) {
  .footer__nav {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.footer__heading {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-ink-muted);
  margin-bottom: var(--space-3);
}

.footer__links {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer__link {
  color: var(--text-on-ink);
  font-size: var(--text-body-sm);
  text-decoration: none;
}

/*
 * Seal IS legible as text here. It is 1.9:1 on bond but 6.4:1 on ink, so the dark
 * footer is one of the few surfaces where the accent may colour text rather than
 * fill a shape.
 */
.footer__link:hover {
  color: var(--seal);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-8);
  padding-top: var(--space-5);
  border-top: 1px solid var(--rule-on-ink);
  color: var(--text-on-ink-muted);
  font-size: var(--text-body-sm);
}
</style>
