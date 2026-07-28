<script setup lang="ts">
/**
 * Chip
 *
 * The small 2px-radius label used for card examples (`▸ Intake forms`), stat
 * callouts, and compliance markers. Near-square by design — chips are records,
 * not buttons (design spec §1).
 *
 * `tone="redline"` is reserved for BEFORE-state costs so red always means "this
 * is costing you"; it is never decorative. On ink bands it uses the lightened
 * `--redline-text` because full-strength redline is 4.08:1 on ink and these are
 * small mono labels.
 *
 * @example <Chip>Intake forms</Chip>
 * @example <Chip tone="redline">4.2 day lag</Chip>
 */
withDefaults(
  defineProps<{
    tone?: 'neutral' | 'seal' | 'verify' | 'redline'
    /** Prefix the label with the ▸ record marker used on example chips. */
    marker?: boolean
  }>(),
  { tone: 'neutral', marker: false },
)
</script>

<template>
  <span class="chip mono-label" :class="`chip--${tone}`">
    <span v-if="marker" class="chip__marker" aria-hidden="true">▸</span>
    <slot />
  </span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-chip);
  border: 1px solid transparent;
  white-space: nowrap;
}

.chip__marker {
  opacity: 0.7;
}

/* ─── Bond band ──────────────────────────────────────────────────────── */
.chip--neutral {
  color: var(--text-on-bond-muted);
  border-color: var(--rule-on-bond);
}

.chip--seal {
  color: var(--seal-ink);
  background-color: var(--seal-wash);
}

.chip--verify {
  /* verify is 2.63:1 on bond — the wash carries the hue, ink carries the text */
  color: var(--text-on-bond);
  background-color: var(--verify-wash);
}

.chip--redline {
  color: #a3352a;
  background-color: var(--redline-wash);
}

/* ─── Ink band ───────────────────────────────────────────────────────── */
.on-ink .chip--neutral {
  color: var(--text-on-ink-muted);
  border-color: var(--rule-on-ink);
}

.on-ink .chip--seal {
  color: var(--seal);
  background-color: rgba(200, 147, 58, 0.12);
  border-color: rgba(200, 147, 58, 0.3);
}

.on-ink .chip--verify {
  color: var(--verify);
  background-color: rgba(47, 169, 140, 0.12);
  border-color: rgba(47, 169, 140, 0.3);
}

.on-ink .chip--redline {
  color: var(--redline-text);
  background-color: rgba(208, 80, 63, 0.12);
  border-color: rgba(208, 80, 63, 0.32);
}
</style>
