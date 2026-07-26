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
        <p class="footer__note">An operations company. Not affiliated with any referenced tool.</p>
      </div>
    </Container>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--bg-inverse);
  color: var(--text-inverse);
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

.footer__logo {
  display: inline-flex;
}

.footer__tagline {
  color: var(--color-graphite-300);
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
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-graphite-300);
  margin-bottom: var(--space-3);
}

.footer__links {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer__link {
  color: var(--text-inverse);
  font-size: var(--text-body-sm);
}

.footer__link:hover {
  color: var(--color-brass-500);
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-8);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-on-dark);
  color: var(--color-graphite-300);
  font-size: var(--text-body-sm);
}
</style>
