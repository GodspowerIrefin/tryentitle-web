<script setup lang="ts">
/**
 * ExceptionBand (PRD FR15 / §10.3)
 *
 * The compact band on an industry page that answers the two questions a reader
 * asks straight after the use cases: what does this touch, and where does a
 * person stay in it.
 *
 * Left: the categories of software the work moves between — categories, never
 * vendor names, so nothing here reads as a claimed partnership. Right: the
 * human-in-the-loop guarantee for that field, in the brass exception accent,
 * which on this site only ever means "a person is involved" (PRD §10.3). Brass
 * appears once here, as text via `--accent-exception-text`.
 *
 * Presentational; all copy via props (PRD §11.3 rules 3 and 4).
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import ExceptionRail from '@/components/marketing/ExceptionRail'

defineProps<{
  eyebrow: string
  title: string
  /** Categories of systems the work moves between. */
  systems: string[]
  systemsLabel: string
  /** Where a person stays in the work, for this field. */
  human: string
  humanLabel: string
  /** Clarifies that `systems` are categories, not claimed integrations. */
  note: string
}>()
</script>

<template>
  <Section tone="bond" labelledby="exception-title">
    <Container>
      <SectionHeader :eyebrow="eyebrow" :title="title" title-id="exception-title" />

      <div class="band">
        <div class="band__flow" aria-hidden="false">
          <ExceptionRail />
        </div>

        <div class="band__panels">
          <div class="panel">
            <p class="panel__label">{{ systemsLabel }}</p>
            <ul class="systems">
              <li v-for="system in systems" :key="system" class="system">{{ system }}</li>
            </ul>
            <p class="panel__note">{{ note }}</p>
          </div>

          <div class="panel panel--human">
            <p class="panel__label panel__label--human">
              <Icon name="users" :size="16" />
              <span>{{ humanLabel }}</span>
            </p>
            <p class="panel__human">{{ human }}</p>
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.band {
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
  margin-top: var(--stack-lead);
}

.band__flow {
  display: flex;
  justify-content: center;
  padding: var(--space-5);
  background-color: var(--cream);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
}

.band__panels {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .band__panels {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--cream);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-card);
}

.panel--human {
  background-color: var(--seal-wash);
  border-color: color-mix(in srgb, var(--seal) 40%, var(--rule-on-bond));
  border-inline-start: 2px solid var(--seal);
}

.panel__label {
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
}

.panel__label--human {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--seal-ink);
}

.systems {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.system {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--rule-on-bond);
  border-radius: var(--radius-chip);
  background-color: var(--bond);
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  color: var(--text-on-bond);
}

.panel__note {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-sm);
}

.panel__human {
  color: var(--seal-ink);
  font-size: var(--text-body);
}
</style>
