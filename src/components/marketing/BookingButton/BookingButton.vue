<script setup lang="ts">
/**
 * BookingButton
 *
 * The ONLY component that knows the booking destination (PRD FR2). Every CTA on
 * the site renders through here, so all bookings resolve to one URL and changing
 * the scheduler is a one-line change in lib/constants.ts.
 *
 * Each placement passes a `placement` slug, appended as a UTM parameter so it is
 * possible to learn which CTA converts (PRD §11.6). The default is a plain link
 * (`target=_blank`, `rel=noopener noreferrer`) — it works with JS disabled, is
 * crawlable, and costs nothing (NFR8).
 *
 * `pill` renders the premium-design pill (orange, black text, text arrow) instead
 * of the Button primitive. Its hover ground is `paper` on dark chrome and `ink`
 * on light bands. Padding and font size come from the caller's class.
 *
 * @example <BookingButton placement="hero" size="lg" />
 */
import { computed } from 'vue'
import Button from '@/components/primitives/Button'
import Icon from '@/components/primitives/Icon'
import { bookingUrl, BOOKING_LABEL } from '@/lib/constants'

const props = withDefaults(
  defineProps<{
    /** UTM slug identifying where this CTA sits: hero | nav | closing | footer. */
    placement: string
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'md' | 'lg'
    /** Override the default label; the default is the canonical booking label. */
    label?: string
    /** Show the trailing arrow. On by default. */
    withIcon?: boolean
    /**
     * Optional note handed to the scheduler as its first custom answer (`a1`),
     * so the call can open with context the visitor already produced — the hours
     * calculator uses this to pass its computed figure through (§4.10).
     */
    prefill?: string
    /** Render the premium-design pill instead of the Button primitive. */
    pill?: boolean
    /** Pill hover ground. */
    hover?: 'ink' | 'paper'
  }>(),
  { variant: 'primary', size: 'md', withIcon: true, pill: false, hover: 'ink' },
)

const href = computed(() =>
  bookingUrl(props.placement, props.prefill ? { a1: props.prefill } : undefined),
)
const text = computed(() => props.label ?? BOOKING_LABEL)
</script>

<template>
  <a
    v-if="pill"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="pill"
    :class="`pill--hover-${hover}`"
  >
    {{ text }}
    <span v-if="withIcon" class="pill__arrow" aria-hidden="true">→</span>
  </a>
  <Button v-else :href="href" external :variant="variant" :size="size">
    {{ text }}
    <Icon v-if="withIcon" name="arrow-right" :size="18" />
  </Button>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: var(--orange);
  color: var(--black);
  padding: 14px 28px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.pill__arrow {
  font-size: 0.93em;
}

.pill--hover-ink:hover {
  background: var(--charcoal);
  color: var(--paper);
}

.pill--hover-paper:hover {
  background: var(--paper);
  color: var(--black);
}
</style>
