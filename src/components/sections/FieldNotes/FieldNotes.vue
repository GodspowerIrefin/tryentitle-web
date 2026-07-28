<script setup lang="ts">
/**
 * FieldNotes — Bond band (design spec §4.12)
 *
 * Depth signal and SEO surface: three post teasers with category, title, hook,
 * and read time.
 *
 * EMPTY STATE: renders nothing when there are no published posts. The spec lists
 * three "launch stubs" as example titles, but shipping stub cards that link to
 * posts which do not exist would be placeholder content — barred by PRD FR18 and
 * the launch checklist ("no placeholder text"). Write the posts and this section
 * appears on its own.
 */
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Button from '@/components/primitives/Button'
import Icon from '@/components/primitives/Icon'
import FeatureCard from '@/components/sections/FeatureCard'
import SectionHeader from '@/components/sections/SectionHeader'

export interface FieldNote {
  slug: string
  title: string
  category: string
  hook: string
  readingTime: string
}

const props = defineProps<{
  eyebrow: string
  title: string
  items: readonly FieldNote[]
}>()

const teasers = () => props.items.slice(0, 3)
</script>

<template>
  <Section v-if="items.length" tone="bond" labelledby="notes-title">
    <Container>
      <div class="notes__head">
        <SectionHeader :eyebrow="eyebrow" :title="title" title-id="notes-title" />
        <Button to="/blog" variant="secondary">
          All field notes
          <Icon name="arrow-right" :size="16" />
        </Button>
      </div>

      <ul class="notes">
        <li v-for="note in teasers()" :key="note.slug" data-reveal>
          <FeatureCard
            :eyebrow="note.category"
            :title="note.title"
            :body="note.hook"
            :chips="[note.readingTime]"
            :to="`/blog/${note.slug}`"
            cta="Read"
          />
        </li>
      </ul>
    </Container>
  </Section>
</template>

<style scoped>
.notes__head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-5);
}

.notes {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  grid-template-columns: 1fr;
}

@media (min-width: 700px) {
  .notes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
