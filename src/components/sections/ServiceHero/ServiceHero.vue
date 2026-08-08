<script setup lang="ts">
/**
 * ServiceHero — Bond band opening a service detail page.
 *
 * The same device as the home Hero: a full-bleed workspace photograph with an
 * inset paper panel carrying the breadcrumb, the service name, its outcome line,
 * and the booking pill. The two heroes are deliberately the same object — a
 * visitor arriving on a service page from search should land in the same room as
 * one who came through the front door.
 *
 * This replaced an ink band with a ghost-icon rail. That version put the page's
 * darkest surface directly under a dark header and spent its whole right-hand
 * column on a decorative watermark, so the first screen carried one column of
 * copy and a large empty square. The panel-on-photo layout gives the same copy a
 * frame and hands the rest of the width to the photograph.
 *
 * Presentational — all copy arrives via props (PRD §11.3 rule 4).
 */
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Section from '@/components/primitives/Section'
import Container from '@/components/primitives/Container'
import Eyebrow from '@/components/primitives/Eyebrow'
import Heading from '@/components/primitives/Heading'
import Chip from '@/components/primitives/Chip'
import Icon, { type IconName } from '@/components/primitives/Icon'
import BookingButton from '@/components/marketing/BookingButton'
import { splitLines } from '@/lib/motion/split'

interface Crumb {
  label: string
  to?: string
}

defineProps<{
  breadcrumbs: Crumb[]
  eyebrow: string
  title: string
  /** The outcome, in the customer's terms — the panel's supporting line. */
  headline: string
  chips: readonly string[]
  icon: IconName
}>()

const revealed = ref(false)
const panel = ref<HTMLElement | null>(null)

onMounted(() => {
  requestAnimationFrame(() => (revealed.value = true))

  // Split after the webfont lands, or the measured lines belong to the fallback.
  void (document.fonts?.ready ?? Promise.resolve()).then(() => {
    const heading = panel.value?.querySelector('h1')
    if (heading && splitLines(heading)) {
      requestAnimationFrame(() => heading.classList.add('is-split-in'))
    }
  })
})
</script>

<template>
  <Section as="section" tone="bond" class="service-hero" labelledby="service-title">
    <div class="service-hero__media" aria-hidden="true">
      <img
        class="service-hero__photo"
        src="/images/hero-tech.jpg"
        alt=""
        width="2400"
        height="1598"
        decoding="async"
        fetchpriority="high"
      />
      <div class="service-hero__wash" />
    </div>

    <Container class="service-hero__frame">
      <div ref="panel" class="panel" :class="{ 'is-revealed': revealed }">
        <nav class="crumbs panel__step" style="--i: 0" aria-label="Breadcrumb">
          <ol>
            <li v-for="(crumb, i) in breadcrumbs" :key="i">
              <RouterLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</RouterLink>
              <span v-else aria-current="page">{{ crumb.label }}</span>
            </li>
          </ol>
        </nav>

        <div class="panel__mark panel__step" style="--i: 1">
          <span class="panel__tile" aria-hidden="true">
            <Icon :name="icon" :size="22" />
          </span>
          <Eyebrow>{{ eyebrow }}</Eyebrow>
        </div>

        <Heading
          id="service-title"
          :level="1"
          size="h1"
          class="panel__title panel__step"
          style="--i: 2"
        >
          {{ title }}
        </Heading>

        <div class="panel__foot panel__step" style="--i: 3">
          <p class="panel__headline">{{ headline }}</p>
          <div class="panel__actions">
            <BookingButton placement="service-hero" size="lg" data-magnetic />
          </div>
        </div>

        <ul v-if="chips.length" class="panel__chips panel__step" style="--i: 4">
          <li v-for="chip in chips" :key="chip">
            <Chip tone="seal" marker>{{ chip }}</Chip>
          </li>
        </ul>
      </div>
    </Container>
  </Section>
</template>

<style scoped>
/* `.section.service-hero` — see Hero: outranks Section's own rhythm rule instead
   of tying with it. */
.section.service-hero {
  position: relative;
  isolation: isolate;
  overflow: clip;
  /* Sized by `min-height` like the home Hero — this is the floor that keeps the
     panel off the band edges, not the section rhythm. */
  min-height: min(72vh, 42rem);
  padding-block: var(--section-rhythm-compact);
  display: flex;
  align-items: center;
  background-color: var(--bond);
}

.service-hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.service-hero__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Paper wash — the panel sits on the bright left third, so the gradient is
   heaviest there and lets the photograph breathe on the right. */
.service-hero__wash {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(244, 243, 241, 0.78) 0%,
      rgba(244, 243, 241, 0.32) 46%,
      transparent 72%
    ),
    linear-gradient(180deg, rgba(244, 243, 241, 0.4) 0%, transparent 30%, rgba(244, 243, 241, 0.24) 100%);
}

.service-hero__frame {
  position: relative;
  z-index: 1;
  width: 100%;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: min(100%, 40rem);
  padding: clamp(1.5rem, 3vw, 2.75rem);
  background-color: color-mix(in srgb, var(--bond-raised) 94%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 1.5rem;
  box-shadow: 0 24px 60px rgba(15, 31, 26, 0.12);
  backdrop-filter: blur(8px);
}

/* ─── Breadcrumb ─────────────────────────────────────────────────────── */
.crumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  color: var(--text-on-bond-muted);
}

.crumbs li:not(:last-child)::after {
  content: '/';
  margin-inline-start: var(--space-2);
  color: var(--rule-on-bond);
}

.crumbs a {
  color: var(--text-on-bond-muted);
  text-decoration: none;
}

.crumbs a:hover {
  color: var(--seal-ink);
}

/* ─── Panel content ──────────────────────────────────────────────────── */
.panel__mark {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.panel__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex: none;
  border-radius: var(--radius-card);
  background-color: var(--ink);
  color: var(--seal);
}

.panel__title {
  color: var(--text-on-bond);
  max-width: 14ch;
}

.panel__foot {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-5);
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--rule-on-bond);
}

.panel__headline {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 400;
  letter-spacing: var(--tracking-display);
  line-height: 1.2;
  color: var(--text-on-bond);
  max-width: 24ch;
  text-wrap: balance;
}

.panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

/* The foot goes side-by-side once there is room for the pill beside the line —
   the reference layout's copy-left / action-right row. */
@media (min-width: 720px) {
  .panel__foot {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-6);
  }

  .panel__headline {
    flex: 1;
    max-width: 20ch;
  }

  .panel__actions {
    flex: none;
  }
}

@media (min-width: 1000px) {
  .panel {
    width: min(100%, 44rem);
    padding: var(--space-8);
  }
}

/* ─── Entrance ───────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: no-preference) {
  /*
   * TRANSFORM ONLY — no opacity. Same rule the scroll reveals follow, and for
   * the same reason (globals.css): a contrast checker measures the BLENDED
   * colour of a fading element, so while this panel eased in, the booking
   * button measured #53575b on #ff9356 — 3.31:1 — and the a11y gate failed
   * whenever the scan landed inside the transition. It was intermittent, which
   * is worse than a steady failure: the same commit passed or failed on timing.
   */
  .panel__step {
    transform: translateY(12px);
    transition: transform var(--duration-slow) var(--ease-standard);
    transition-delay: calc(var(--i, 0) * 70ms);
  }

  .panel.is-revealed .panel__step {
    transform: translateY(0);
  }

  .service-hero__photo {
    transform: scale(1.04);
    transition: transform 1.2s var(--ease-standard);
  }

  .service-hero:has(.panel.is-revealed) .service-hero__photo {
    transform: scale(1);
  }
}

/* Narrow: the photo becomes a backdrop the panel sits on top of, so the wash
   flips to vertical and the panel takes the full gutter width. */
@media (max-width: 719px) {
  /* Matches the specificity of the base rule above, which it has to override. */
  .section.service-hero {
    min-height: auto;
    align-items: flex-end;
    padding-block: var(--section-rhythm-compact);
  }

  .service-hero__wash {
    background: linear-gradient(
      180deg,
      transparent 14%,
      rgba(244, 243, 241, 0.58) 46%,
      rgba(244, 243, 241, 0.93) 100%
    );
  }

  .panel {
    width: 100%;
    border-radius: 1.25rem;
  }
}
</style>
