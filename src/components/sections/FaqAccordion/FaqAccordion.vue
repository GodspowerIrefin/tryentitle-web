<script setup lang="ts">
/**
 * FaqAccordion — Bond band (design spec §4.13)
 *
 * Clears the last objections before the closing CTA. Single-open accordion with
 * a seal +/× marker and a height ease.
 *
 * Accessibility contract:
 * - Each question is a real <button> inside an <h3>, carrying `aria-expanded` and
 *   `aria-controls`; the panel is `role="region"` labelled by its button, which is
 *   the standard ARIA accordion shape. Screen-reader users can navigate the
 *   questions by heading.
 * - NOT a <dl>: a definition list may not contain a `role="region"`, so the
 *   dt/dd version failed axe's `definition-list` rule. Headings are also the
 *   better semantic here — these are sections of content, not term/definition
 *   pairs.
 * - Single-open is a design choice, not a keyboard trap: every panel is reachable
 *   and Enter/Space toggles. Nothing is hidden from find-in-page that the user
 *   cannot then open.
 * - The +/× marker is `aria-hidden`; state is conveyed by `aria-expanded`.
 *
 * Presentational; items arrive via props (PRD §11.3 rule 3).
 */
import { ref } from 'vue'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Icon from '@/components/primitives/Icon'
import SectionHeader from '@/components/sections/SectionHeader'
import type { FaqItem } from '@/data/faq'

defineProps<{
  eyebrow: string
  title: string
  items: readonly FaqItem[]
}>()

/** Index of the open panel; null means all closed. */
const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <Section tone="bond" labelledby="faq-title">
    <Container>
      <div class="faq-layout">
        <SectionHeader :eyebrow="eyebrow" :title="title" title-id="faq-title" />

        <div class="faq">
          <div v-for="(item, i) in items" :key="item.question" class="faq__item" data-reveal>
            <h3 class="faq__heading">
              <button
                :id="`faq-q-${i}`"
                type="button"
                class="faq__question"
                :aria-expanded="openIndex === i"
                :aria-controls="`faq-a-${i}`"
                @click="toggle(i)"
              >
                <span>{{ item.question }}</span>
                <Icon
                  :name="openIndex === i ? 'minus' : 'plus'"
                  :size="18"
                  class="faq__marker"
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              :id="`faq-a-${i}`"
              class="faq__answer"
              role="region"
              :aria-labelledby="`faq-q-${i}`"
              :hidden="openIndex !== i"
            >
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
.faq-layout {
  display: grid;
  gap: var(--space-8);
}

@media (min-width: 960px) {
  .faq-layout {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-9);
    align-items: start;
  }
}

.faq {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--rule-on-bond);
}

.faq__item {
  border-bottom: 1px solid var(--rule-on-bond);
}

.faq__heading {
  margin: 0;
  font: inherit;
  letter-spacing: normal;
}

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  padding-block: var(--space-4);
  text-align: start;
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  font-weight: 600;
  color: var(--text-on-bond);
  line-height: 1.35;
}

.faq__marker {
  flex: none;
  color: var(--seal-ink);
}

.faq__answer {
  padding-bottom: var(--space-5);
  color: var(--text-on-bond-muted);
  max-width: var(--measure);
}

/* `hidden` must win over the flex/grid display the panel would otherwise take. */
.faq__answer[hidden] {
  display: none;
}
</style>
