<script setup lang="ts">
/**
 * SiteFooter
 *
 * Charcoal footer from the premium design: logo, tagline and booking pill on the
 * left; Solutions / Industries / Company / Legal columns on the right; copyright
 * and the contact address along the bottom rule.
 *
 * Link groups come from the canonical navigation data so the footer can never
 * drift from the source of truth.
 */
import { RouterLink } from 'vue-router'
import BookingButton from '@/components/marketing/BookingButton'
import { FOOTER_GROUPS } from '@/data/navigation'
import { CONTACT, SITE_TAGLINE } from '@/lib/constants'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__top">
      <div>
        <RouterLink to="/" class="footer__logo" aria-label="TryEntitle — home">
          <img
            src="/brand/logo-mark@2x.png"
            alt=""
            width="144"
            height="180"
            class="footer__mark"
            loading="lazy"
            decoding="async"
          />
          <span class="footer__word" aria-hidden="true"><span class="logo__word-try">Try</span>Entitle</span>
        </RouterLink>
        <p class="footer__tagline">{{ SITE_TAGLINE }}</p>
        <BookingButton placement="footer" pill hover="paper" class="footer__cta" />
      </div>

      <nav class="footer__nav" aria-label="Footer">
        <div v-for="group in FOOTER_GROUPS" :key="group.heading">
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
      <p>© {{ year }} <span class="footer__name">TryEntitle</span>. All rights reserved.</p>
      <a :href="`mailto:${CONTACT.general}`" class="footer__mail">{{ CONTACT.general }}</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--charcoal);
  color: var(--paper);
}

.footer__top {
  max-width: 1240px;
  margin: 0 auto;
  padding: 88px 32px 40px;
  display: grid;
  grid-template-columns: minmax(200px, 280px) minmax(0, 1fr);
  gap: 48px;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}

.footer__mark {
  height: 52px;
  width: auto;
  display: block;
}

.footer__word {
  font-size: 27px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--paper);
}

.logo__word-try {
  color: var(--orange);
}

.footer__tagline {
  font-size: 17px;
  color: var(--stone-400);
  margin-top: 22px;
}

.footer__cta {
  margin-top: 30px;
  gap: 10px;
  padding: 15px 30px;
  font-size: 16px;
}

.footer__nav {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 36px 24px;
}

.footer__heading {
  font-family: var(--font-body);
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--stone-550);
  font-weight: 500;
  font-variation-settings: normal;
}

.footer__links {
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer__link {
  font-size: 16px;
  color: var(--paper);
  text-decoration: none;
}

.footer__link:hover {
  color: var(--orange);
}

.footer__bottom {
  max-width: 1240px;
  margin: 0 auto;
  padding: 26px 32px 44px;
  border-top: 1px solid var(--charcoal-rule);
  display: flex;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 15px;
  color: var(--stone-400);
}

.footer__name {
  font-weight: 600;
}

.footer__mail {
  color: var(--stone-400);
  text-decoration: none;
}

.footer__mail:hover {
  color: var(--orange);
}

/* The design is desktop-first; below these widths the columns stack so the
   footer never scrolls sideways. */
@media (max-width: 900px) {
  .footer__top {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .footer__top {
    padding: 64px 20px 32px;
  }
  .footer__bottom {
    padding: 24px 20px 36px;
  }
  .footer__nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
