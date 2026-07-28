<script setup lang="ts">
/**
 * SiteHeader
 *
 * Sticky site header (PRD FR1): logo (links home), primary nav, and the booking
 * CTA — visible at every scroll position. It collapses to a compact height after
 * ~80px of scroll so it stays out of the way without ever leaving.
 *
 * The CTA is rendered as a BookingButton, visually distinct from nav links at
 * every breakpoint (PRD §6.1). On mobile the nav collapses into MobileNav; this
 * component owns the open state and returns focus to the toggle on close.
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import Logo from '@/components/layout/Logo'
import MobileNav from '@/components/layout/MobileNav'
import BookingButton from '@/components/marketing/BookingButton'
import { PRIMARY_NAV } from '@/data/navigation'

const compact = ref(false)
const menuOpen = ref(false)
const toggleBtn = ref<HTMLButtonElement | null>(null)
/** 0–1 scroll position, drives the seal progress line along the bottom edge. */
const progress = ref(0)

function onScroll() {
  compact.value = window.scrollY > 40
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  // Guard the divide: a page shorter than the viewport has nothing to progress
  // through, and 0/0 would put NaN into a style binding.
  progress.value = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Return focus to the trigger when the mobile panel closes (PRD NFR5).
//
// Deferred to the next tick on purpose: MobileNav marks #app `inert` while the
// panel is open, and an inert subtree cannot take focus. Watcher order between
// these two components is not guaranteed, so focusing synchronously can land
// while the attribute is still set and silently do nothing.
watch(menuOpen, async (open, wasOpen) => {
  if (wasOpen && !open) {
    await nextTick()
    toggleBtn.value?.focus()
  }
})
</script>

<template>
  <header class="header on-ink" :class="{ 'header--compact': compact }">
    <Container>
      <div class="header__bar">
        <RouterLink to="/" class="header__logo" aria-label="TryEntitle — home">
          <Logo />
        </RouterLink>

        <nav class="header__nav" aria-label="Primary">
          <RouterLink
            v-for="link in PRIMARY_NAV"
            :key="link.to"
            :to="link.to"
            class="header__link"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="header__cta">
          <BookingButton placement="nav" variant="primary" :with-icon="false" />
        </div>

        <button
          ref="toggleBtn"
          type="button"
          class="header__toggle"
          aria-label="Open menu"
          aria-haspopup="dialog"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <Icon name="menu" :size="24" />
        </button>
      </div>
    </Container>

    <!-- Seal scroll-progress line along the bottom edge (design spec §4.1).
         Decorative: it duplicates information the scrollbar already conveys, so
         it is hidden from assistive tech rather than announced as a progressbar. -->
    <div
      class="header__progress"
      aria-hidden="true"
      :style="{ transform: `scaleX(${progress})` }"
    />

    <MobileNav :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>

<style scoped>
/*
 * The header is ALWAYS ink, and carries `.on-ink` so its children pick
 * band-correct colours.
 *
 * The spec asks for "transparent over hero, solidifies on scroll" (§4.1). Ink
 * achieves that on the home page for free — the hero is also ink, so the bar
 * merges into it and only the rule appears on scroll. Literal transparency would
 * break every other route: services, industries, blog, and legal pages all open
 * on a BOND band, where light nav text on a transparent bar would be invisible.
 * One always-legible treatment beats a per-route special case.
 */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--ink);
  color: var(--text-on-ink);
  border-bottom: 1px solid transparent;
  transition: border-color var(--duration-base) var(--ease-standard);
}

.header--compact {
  background-color: color-mix(in srgb, var(--ink) 94%, transparent);
  backdrop-filter: saturate(1.1) blur(10px);
  border-bottom-color: var(--rule-on-ink);
}

/* The tall bar is a desktop affordance only — on a 640px-high viewport those
   extra 24px come straight out of the hero's fold budget (FR7). */
.header__bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  height: var(--header-height);
  transition: height var(--duration-base) var(--ease-standard);
}

@media (min-width: 860px) {
  .header__bar {
    height: var(--header-height-tall);
  }
}

.header--compact .header__bar {
  height: var(--header-height);
}

.header__progress {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 2px;
  background-color: var(--seal);
  transform-origin: left center;
  /* No transition: this tracks scroll directly, and easing it would make the
     line lag the page. */
}

/* The wordmark is not running text — the global link underline does not
   belong on it. */
.header__logo {
  display: inline-flex;
  text-decoration: none;
  margin-inline-end: auto;
}

.header__nav {
  display: none;
  gap: var(--space-5);
}

.header__link {
  color: var(--text-on-ink-muted);
  font-weight: 500;
  font-size: var(--text-body-sm);
  text-decoration: none;
  padding-block: var(--space-1);
  border-bottom: 1px solid transparent;
  transition:
    color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}

.header__link:hover {
  color: var(--text-on-ink);
}

/* Current page is marked with the seal rule — legible on ink at 6.4:1, and the
   one place the accent appears in the chrome. */
.header__link.router-link-active {
  color: var(--text-on-ink);
  border-bottom-color: var(--seal);
}

.header__cta {
  display: none;
}

.header__toggle {
  display: inline-flex;
  padding: var(--space-2);
  color: var(--text-on-ink);
}

@media (min-width: 860px) {
  .header__nav,
  .header__cta {
    display: flex;
    align-items: center;
  }
  .header__toggle {
    display: none;
  }
}
</style>
