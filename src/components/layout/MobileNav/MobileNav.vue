<script setup lang="ts">
/**
 * MobileNav
 *
 * The full-height mobile navigation panel (PRD §6.1), in the premium design's
 * charcoal chrome.
 *
 * Accessibility contract (PRD NFR5, §12.5):
 * - Modal dialog: focus is trapped inside while open, Tab and Shift+Tab cycle
 *   within the panel, Escape closes it, and focus returns to the trigger on
 *   close (handled by the parent via the `close` event).
 * - The booking CTA is pinned inside the panel and never scrolls out of reach.
 * - Background scroll is locked and the rest of the app is marked `inert`.
 */
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/primitives/Icon'
import BookingButton from '@/components/marketing/BookingButton'
import { PRIMARY_NAV } from '@/data/navigation'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)

function focusables(): HTMLElement[] {
  if (!panel.value) return []
  return Array.from(
    panel.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
    return
  }
  if (e.key !== 'Tab') return
  const items = focusables()
  if (items.length === 0) return
  const first = items[0]!
  const last = items[items.length - 1]!
  const active = document.activeElement as HTMLElement | null
  if (e.shiftKey && active === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

/** The panel is teleported to <body>, so it stays live while #app goes inert. */
function setBackgroundInert(inert: boolean) {
  const app = document.getElementById('app')
  if (!app) return
  if (inert) app.setAttribute('inert', '')
  else app.removeAttribute('inert')
}

watch(
  () => props.open,
  async (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
      setBackgroundInert(true)
      await nextTick()
      focusables()[0]?.focus()
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeydown)
      setBackgroundInert(false)
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
    setBackgroundInert(false)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="open" class="scrim" @click.self="emit('close')">
        <div
          ref="panel"
          class="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div class="panel__head">
            <span class="panel__label">Menu</span>
            <button type="button" class="panel__close" aria-label="Close menu" @click="emit('close')">
              <Icon name="close" :size="24" />
            </button>
          </div>

          <nav class="panel__nav" aria-label="Primary">
            <RouterLink
              v-for="link in PRIMARY_NAV"
              :key="link.to"
              :to="link.to"
              class="panel__link"
              @click="emit('close')"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <div class="panel__cta">
            <BookingButton placement="mobile-nav" pill hover="paper" class="panel__pill" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 90;
  background-color: rgb(0 0 0 / 0.6);
  display: flex;
  justify-content: flex-end;
}

.panel {
  display: flex;
  flex-direction: column;
  width: min(90vw, 360px);
  height: 100dvh;
  background-color: var(--charcoal);
  color: var(--paper);
  padding: 20px;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 8px 16px;
  border-bottom: 1px solid var(--charcoal-rule);
}

.panel__label {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--stone-550);
}

.panel__close {
  display: inline-flex;
  padding: 8px;
  color: var(--paper);
}

.panel__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-block: 16px;
  overflow-y: auto;
  flex: 1 0 auto;
}

.panel__link {
  font-size: 30px;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--paper);
  text-decoration: none;
  padding-block: 8px;
}

.panel__link:hover {
  color: var(--orange);
}

.panel__cta {
  padding-top: 16px;
  border-top: 1px solid var(--charcoal-rule);
}

.panel__pill {
  width: 100%;
  justify-content: center;
  padding: 15px 30px;
  font-size: 16px;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity var(--duration-base) var(--ease-standard);
}
.panel-enter-active .panel,
.panel-leave-active .panel {
  transition: transform var(--duration-base) var(--ease-standard);
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}
.panel-enter-from .panel,
.panel-leave-to .panel {
  transform: translateX(100%);
}
</style>
