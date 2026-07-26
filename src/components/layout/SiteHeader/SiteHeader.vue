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
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

function onScroll() {
  compact.value = window.scrollY > 80
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Return focus to the trigger when the mobile panel closes (PRD NFR5).
watch(menuOpen, (open, wasOpen) => {
  if (wasOpen && !open) toggleBtn.value?.focus()
})
</script>

<template>
  <header class="header" :class="{ 'header--compact': compact }">
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

    <MobileNav :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: color-mix(in srgb, var(--bg-canvas) 85%, transparent);
  backdrop-filter: saturate(1.1) blur(8px);
  border-bottom: 1px solid var(--border-subtle);
}

.header__bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  height: 72px;
  transition: height var(--duration-base) var(--ease-standard);
}

.header--compact .header__bar {
  height: var(--header-height);
}

.header__logo {
  display: inline-flex;
  margin-inline-end: auto;
}

.header__nav {
  display: none;
  gap: var(--space-5);
}

.header__link {
  color: var(--text-primary);
  font-weight: 500;
  font-size: var(--text-body-sm);
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--action-primary);
}

.header__cta {
  display: none;
}

.header__toggle {
  display: inline-flex;
  padding: var(--space-2);
  color: var(--text-primary);
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
