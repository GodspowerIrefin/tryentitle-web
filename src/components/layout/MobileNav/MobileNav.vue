<script setup lang="ts">
/**
 * MobileNav
 *
 * The full-height mobile navigation panel (PRD §6.1). Client-interactive by
 * necessity — this is the smallest leaf that owns the open/close behaviour so
 * the rest of the header stays static (PRD §11.3 rule 7 intent).
 *
 * Accessibility contract (PRD NFR5, §12.5):
 * - Rendered as a modal dialog: focus is trapped inside while open, Tab and
 *   Shift+Tab cycle within the panel, Escape closes it, and focus returns to the
 *   trigger on close (handled by the parent via the `close` event).
 * - The booking CTA is pinned inside the panel and never scrolls out of reach.
 * - Background scroll is locked while the panel is open.
 * - The rest of the app is marked `inert` while open, so background content is
 *   removed from the accessibility tree, from tab order, and from hit-testing.
 *   `aria-modal` alone only advises screen readers; it leaves the background
 *   live for everything else (and an axe scan flags contrast on content sitting
 *   under the 40% scrim, which is real — that text is genuinely unreadable).
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

/**
 * Toggle `inert` on the app root. The panel is teleported to <body>, so it is a
 * SIBLING of #app and stays interactive while everything behind it goes inert.
 */
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
            <BookingButton placement="mobile-nav" variant="primary" size="lg" />
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
  background-color: var(--scrim);
  display: flex;
  justify-content: flex-end;
}

.panel {
  display: flex;
  flex-direction: column;
  width: min(90vw, 360px);
  height: 100dvh;
  background-color: var(--cream);
  box-shadow: var(--shadow-overlay);
  padding: var(--space-4);
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--rule-on-bond);
}

.panel__label {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
}

.panel__close {
  display: inline-flex;
  padding: var(--space-2);
  color: var(--text-on-bond);
}

.panel__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-block: var(--space-4);
  overflow-y: auto;
  flex: 1 0 auto;
}

.panel__link {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 400;
  color: var(--text-on-bond);
  padding-block: var(--space-2);
}

.panel__link:hover {
  color: var(--text-on-bond);
}

/* CTA pinned to the bottom of the panel, never scrolls out of reach */
.panel__cta {
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
}

.panel__cta :deep(.btn) {
  width: 100%;
}

/* Slide-in; motion respects the reduced-motion reset in globals.css */
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
