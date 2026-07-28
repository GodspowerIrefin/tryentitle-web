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
  }>(),
  { variant: 'primary', size: 'md', withIcon: true },
)

const href = computed(() =>
  bookingUrl(props.placement, props.prefill ? { a1: props.prefill } : undefined),
)
const text = computed(() => props.label ?? BOOKING_LABEL)
</script>

<template>
  <Button :href="href" external :variant="variant" :size="size">
    {{ text }}
    <Icon v-if="withIcon" name="arrow-right" :size="18" />
  </Button>
</template>
