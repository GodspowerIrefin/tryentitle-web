<script setup lang="ts">
/**
 * SectionHeader
 *
 * The shared eyebrow + heading block that opens most sections. Presentational;
 * all copy via props (PRD §11.3 rule 4). Emits a heading with the given id so the
 * parent Section can wire aria-labelledby.
 *
 * Two supporting-copy slots, and they are not interchangeable:
 *  - `intro` sits UNDER the heading in a narrow column. Use when the heading is
 *    short and the section below is wide.
 *  - `aside` sits BESIDE the heading on a second column from 900px. Use when the
 *    heading is long: on its own a long heading breaks to four lines and leaves
 *    two-thirds of the row empty, and the aside both fills that space and pulls
 *    the heading down to two lines.
 *
 * Band-aware through inheritance: colours resolve from the `.on-ink` context
 * that Section sets, so this never needs a dark variant of its own.
 */
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'

defineProps<{
  eyebrow: string
  title: string
  titleId: string
  /** Supporting line under the heading, in a narrow column. */
  intro?: string
  /** Supporting line beside the heading, filling the right of the row. */
  aside?: string
  /** Heading level for correct document outline. Section leads are usually h2. */
  level?: 1 | 2 | 3
}>()
</script>

<template>
  <div class="section-header" :class="{ 'section-header--split': aside }" data-reveal>
    <div class="section-header__lead">
      <Eyebrow>{{ eyebrow }}</Eyebrow>
      <!--
        `data-split-lines` opts this heading into the line-mask entrance: the
        motion layer splits it into its real visual lines and each slides up from
        behind its own clip as the section arrives. Because it sits inside the
        `data-reveal` block above, it shares that block's single trigger rather
        than firing on a threshold of its own — heading and supporting copy
        arrive together instead of drifting apart.

        The full string is preserved as an aria-label by the splitter, so this
        stays one heading to assistive tech. With JS off, or under reduced
        motion, the attribute is inert and the heading renders as plain text.
      -->
      <Heading :id="titleId" :level="level ?? 2" size="h2" data-split-lines>
        {{ title }}
      </Heading>
      <p v-if="intro" class="section-header__intro">{{ intro }}</p>
    </div>
    <p v-if="aside" class="section-header__aside">{{ aside }}</p>
  </div>
</template>

<style scoped>
.section-header {
  display: grid;
  gap: var(--space-5);
  align-items: end;
}

.section-header__lead {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
  max-width: 34ch;
}

/* The split layout gives the heading more room, which is the point — it is used
   precisely where the heading is too long for a 34ch column. */
@media (min-width: 900px) {
  .section-header--split {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: var(--space-8);
  }

  .section-header--split .section-header__lead {
    max-width: none;
  }
}

.section-header__intro,
.section-header__aside {
  color: var(--text-on-bond-muted);
  font-size: var(--text-body-lg);
  max-width: 52ch;
}

.section-header__aside {
  max-width: 44ch;
  padding-bottom: var(--space-2);
}

.on-ink .section-header__intro,
.on-ink .section-header__aside {
  color: var(--text-on-ink-muted);
}
</style>
