<script setup lang="ts">
/**
 * SiteHeader
 *
 * Sticky charcoal header from the premium design: logo + wordmark, primary nav
 * (current page in white, the rest in stone), and the orange booking pill.
 *
 * Below 860px the inline nav collapses into MobileNav; this component owns the
 * open state and returns focus to the toggle on close.
 */
import { nextTick, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/primitives/Icon'
import MobileNav from '@/components/layout/MobileNav'
import BookingButton from '@/components/marketing/BookingButton'
import { PRIMARY_NAV } from '@/data/navigation'

const menuOpen = ref(false)
const toggleBtn = ref<HTMLButtonElement | null>(null)

// Return focus to the trigger when the mobile panel closes (PRD NFR5). Deferred a
// tick: MobileNav marks #app `inert` while open, and inert subtrees reject focus.
watch(menuOpen, async (open, wasOpen) => {
  if (wasOpen && !open) {
    await nextTick()
    toggleBtn.value?.focus()
  }
})
</script>

<template>
  <header class="header">
    <div class="header__bar">
      <RouterLink to="/" class="header__logo" aria-label="TryEntitle — home">
        <img
          src="/brand/logo-mark@2x.png"
          alt=""
          width="144"
          height="180"
          class="header__mark"
          decoding="async"
        />
        <span class="header__word" aria-hidden="true"><span class="logo__word-try">Try</span>Entitle</span>
      </RouterLink>

      <nav class="header__nav" aria-label="Primary">
        <RouterLink
          v-for="link in PRIMARY_NAV"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :exact-active-class="link.to === '/' ? 'is-active' : undefined"
          :active-class="link.to === '/' ? '' : 'is-active'"
        >
          {{ link.label }}
        </RouterLink>
        <BookingButton placement="nav" pill hover="paper" class="header__cta" />
      </nav>

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

    <MobileNav :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--charcoal) 94%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--charcoal-rule);
}

.header__bar {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
}

.header__mark {
  height: 38px;
  width: auto;
  display: block;
}

.header__word {
  font-size: 23px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--paper);
}

.logo__word-try {
  color: var(--orange);
}

.header__nav {
  display: none;
  align-items: center;
  gap: 34px;
  font-size: 14.5px;
  letter-spacing: 0.01em;
}

.header__link {
  color: var(--stone-400);
  text-decoration: none;
}

.header__link.is-active {
  color: var(--paper);
}

.header__link:hover {
  color: var(--orange);
}

.header__cta {
  padding: 12px 24px;
  font-size: 15px;
}

.header__toggle {
  display: inline-flex;
  padding: 8px;
  color: var(--paper);
}

@media (min-width: 860px) {
  .header__nav {
    display: flex;
  }
  .header__toggle {
    display: none;
  }
}

@media (max-width: 560px) {
  .header__bar {
    padding: 0 20px;
    height: 68px;
  }
  .header__mark {
    height: 32px;
  }
  .header__word {
    font-size: 21px;
  }
}
</style>
