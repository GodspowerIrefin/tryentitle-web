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
 * SHAPE: the pill (999px) is reserved for buttons alone. Cards and chips are
 * near-square so they read as documents; the button is the one soft thing on the
 * page and therefore reads as the thing to press (design spec §1).
 *
 * @example <Button to="/services" variant="secondary">See services</Button>
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    /** Visual weight. `primary` is the seal pill, reserved for the booking CTA. */
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
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  padding: var(--space-3) var(--space-5);
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-body-lg);
}

/*
 * Primary — the seal pill. Ink text on orange clears AA; orange text on either
 * ground would not, so the accent is always a FILL under dark text.
 */
.btn--primary {
  background-color: var(--action);
  color: var(--on-action);
}

.btn--primary:hover,
.btn--primary:focus-visible {
  background-color: color-mix(in srgb, var(--action) 82%, var(--ink));
  color: var(--on-action);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--action) 38%, transparent);
  outline: none;
}

/* Secondary — hairline outline, band-aware. */
.btn--secondary {
  background-color: transparent;
  color: var(--text-on-bond);
  border-color: var(--rule-on-bond);
}

.btn--secondary:hover,
.btn--secondary:focus-visible {
  background-color: var(--seal-wash);
  border-color: var(--seal);
  color: var(--seal-ink);
  outline: none;
}

.on-ink .btn--secondary {
  color: var(--text-on-ink);
  border-color: var(--rule-on-ink);
}

.on-ink .btn--secondary:hover,
.on-ink .btn--secondary:focus-visible {
  background-color: color-mix(in srgb, var(--seal) 14%, transparent);
  border-color: var(--seal);
  color: var(--seal);
}

/* Ghost — text-only affordance. */
.btn--ghost {
  background-color: transparent;
  color: inherit;
  padding-inline: var(--space-2);
}

.btn--ghost:hover,
.btn--ghost:focus-visible {
  color: var(--seal-ink);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  outline: none;
}

.on-ink .btn--ghost:hover,
.on-ink .btn--ghost:focus-visible {
  color: var(--seal);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

@media (prefers-reduced-motion: no-preference) {
  .btn:hover:not(:disabled),
  .btn:focus-visible:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn:active:not(:disabled) {
    transform: translateY(0);
  }
}
</style>
