<script setup lang="ts">
/**
 * Button
 *
 * The single interactive action primitive for the site. All CTAs, form submits,
 * and prominent links render through this component so focus, hover, and
 * disabled states stay consistent everywhere.
 *
 * Accessibility contract (PRD §11.3):
 * - Renders a real <button>, <a>, or <RouterLink>; never a clickable <div>.
 * - `to`   → internal navigation via <RouterLink> (SPA, no full reload).
 * - `href` → external navigation via <a>; a real link so middle-click,
 *            cmd-click and "copy link address" behave as users expect.
 * - neither → a <button> for in-page actions (menu toggles, form submit).
 * - Focus ring is visible on keyboard focus only (:focus-visible), never removed.
 *
 * `variant="primary"` is reserved for the booking CTA (see BookingButton).
 *
 * @example <Button to="/services" variant="secondary">See services</Button>
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    /** Visual weight. `primary` is reserved for the booking CTA. */
    variant?: 'primary' | 'secondary' | 'ghost'
    /** Internal route path — renders a <RouterLink>. */
    to?: string
    /** External URL — renders an <a>. */
    href?: string
    /** Adds target/rel for third-party destinations such as the scheduler. */
    external?: boolean
    /** Larger hit area for hero and closing CTAs. */
    size?: 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  { variant: 'secondary', size: 'md', type: 'button' },
)

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const bindings = computed<Record<string, unknown>>(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    return props.external
      ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
      : { href: props.href }
  }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component :is="tag" class="btn" :class="[`btn--${variant}`, `btn--${size}`]" v-bind="bindings">
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-body);
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-5);
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-body-lg);
}

/* Primary — deep evergreen, reserved for the booking CTA */
.btn--primary {
  background-color: var(--action-primary);
  color: var(--text-inverse);
}
.btn--primary:hover {
  background-color: var(--action-hover);
  color: var(--text-inverse);
}

/* Secondary — hairline outline on paper */
.btn--secondary {
  background-color: transparent;
  color: var(--text-primary);
  border-color: var(--action-primary);
}
.btn--secondary:hover {
  border-color: var(--action-primary);
  color: var(--action-primary);
}

/* Ghost — text-only affordance */
.btn--ghost {
  background-color: transparent;
  color: var(--action-primary);
  padding-inline: var(--space-2);
}
.btn--ghost:hover {
  color: var(--action-hover);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
