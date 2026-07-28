<script setup lang="ts">
/**
 * WorkflowStrip — the signature element (design spec §1).
 *
 * A document travelling six stages, with a Before/After toggle. The before-state
 * is a tangled redline chain carrying friction stamps; the after-state is a
 * clean verify track whose fourth node is the one gold-sealed HUMAN CHECK. That
 * gold node states the whole positioning without a sentence of copy, and it is
 * the thing a visitor describes to a colleague.
 *
 * Behaviour:
 * - Auto-demo: holds the before-state for 2s on load, then reveals the after
 *   state and the toggle, so the argument lands before any interaction.
 * - `prefers-reduced-motion`: renders the after-state immediately and statically;
 *   the toggle is still available, nothing auto-plays, nothing loops.
 *
 * Accessibility contract:
 * - The toggle is a real `role="switch"` with `aria-checked` (spec §6).
 * - The graphic is a single labelled image whose `<desc>` describes the CURRENT
 *   state, so assistive tech gets the meaning rather than six loose labels.
 * - The two layers crossfade via opacity; the hidden layer is `aria-hidden` and
 *   pointer-inert so it is never announced twice.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { AFTER_STAGES, BEFORE_STAGES, type WorkflowStage } from '@/data/workflow-strip'

const showAfter = ref(false)
/** The toggle stays hidden until the auto-demo has made its point. */
const toggleReady = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const VIEW_W = 980
const VIEW_H = 210
const X0 = 82
const GAP = 163
const MID = 96

/** Before-state nodes sit at alternating heights so the chain reads as tangled. */
function beforeY(i: number): number {
  return i % 2 === 0 ? MID - 22 : MID + 26
}

const beforeNodes = computed(() =>
  BEFORE_STAGES.map((s, i) => ({ ...s, x: X0 + i * GAP, y: beforeY(i) })),
)
const afterNodes = computed(() =>
  AFTER_STAGES.map((s, i) => ({ ...s, x: X0 + i * GAP, y: MID })),
)

/** Zig-zag connector through the before nodes. */
const beforePath = computed(() =>
  beforeNodes.value.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' '),
)

const afterPath = computed(() => {
  const first = afterNodes.value[0]
  const last = afterNodes.value[afterNodes.value.length - 1]
  return `M ${first?.x ?? X0} ${MID} L ${last?.x ?? X0} ${MID}`
})

const description = computed(() =>
  showAfter.value
    ? 'After: a document moves through six automated stages — intake, extract, validate, human check, route, delivered. The human check is the single point where a person makes a judgment call.'
    : 'Before: a document passes through six manual stages — email inbox, printed, re-keyed, chased, approved, filed — sitting unread, being entered twice, and waiting on approval along the way.',
)

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

onMounted(() => {
  if (prefersReducedMotion()) {
    showAfter.value = true
    toggleReady.value = true
    return
  }
  timer = setTimeout(() => {
    showAfter.value = true
    toggleReady.value = true
  }, 2000)
})

onBeforeUnmount(() => clearTimeout(timer))

function toggle() {
  // A user interaction always wins over the pending auto-demo.
  clearTimeout(timer)
  toggleReady.value = true
  showAfter.value = !showAfter.value
}

/** Stamps sit above or below depending on which way the node is offset. */
function stampY(node: WorkflowStage & { y: number }): number {
  return node.y < MID ? node.y - 30 : node.y + 50
}
</script>

<template>
  <div class="strip">
    <div class="strip__head">
      <p class="strip__state mono-label">
        {{ showAfter ? 'After — one process, one exception' : 'Before — six handoffs, no queue' }}
      </p>

      <button
        type="button"
        class="strip__switch"
        role="switch"
        :aria-checked="showAfter"
        :class="{ 'is-ready': toggleReady }"
        @click="toggle"
      >
        <span class="strip__switch-label">Before</span>
        <span class="strip__track" aria-hidden="true">
          <span class="strip__thumb" />
        </span>
        <span class="strip__switch-label">After</span>
      </button>
    </div>

    <svg
      class="strip__svg"
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      role="img"
      aria-labelledby="strip-title strip-desc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="strip-title">How a document moves through the process</title>
      <desc id="strip-desc">{{ description }}</desc>

      <!-- ─── Before layer ─────────────────────────────────────────── -->
      <g class="layer layer--before" :class="{ 'is-hidden': showAfter }" :aria-hidden="showAfter">
        <path class="line line--before" :d="beforePath" />
        <g v-for="node in beforeNodes" :key="`b-${node.label}`">
          <rect
            class="node node--before"
            :x="node.x - 11"
            :y="node.y - 11"
            width="22"
            height="22"
            rx="2"
          />
          <text class="label label--before" :x="node.x" :y="node.y + 36" text-anchor="middle">
            {{ node.label.toUpperCase() }}
          </text>
          <text
            v-if="node.stamp"
            class="stamp"
            :x="node.x"
            :y="stampY(node)"
            text-anchor="middle"
          >
            {{ node.stamp }}
          </text>
        </g>
      </g>

      <!-- ─── After layer ──────────────────────────────────────────── -->
      <g class="layer layer--after" :class="{ 'is-hidden': !showAfter }" :aria-hidden="!showAfter">
        <path class="line line--after" :d="afterPath" />

        <!-- The travelling document token. Straight track, so a transform
             animation is enough — no offset-path, no per-frame JS. -->
        <rect class="token" x="-7" y="-7" width="14" height="14" rx="2" :style="{ '--y': `${MID}px` }" />

        <g v-for="node in afterNodes" :key="`a-${node.label}`">
          <template v-if="node.human">
            <circle class="node-ring" :cx="node.x" :cy="node.y" r="22" />
            <circle class="node node--human" :cx="node.x" :cy="node.y" r="13" />
          </template>
          <rect
            v-else
            class="node node--after"
            :x="node.x - 11"
            :y="node.y - 11"
            width="22"
            height="22"
            rx="2"
          />
          <text
            class="label"
            :class="node.human ? 'label--human' : 'label--after'"
            :x="node.x"
            :y="node.y + 40"
            text-anchor="middle"
          >
            {{ node.label.toUpperCase() }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.strip {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background-color: var(--ink-raised);
  border: 1px solid var(--rule-on-ink);
  border-radius: var(--radius-card);
  padding: clamp(var(--space-4), 3vw, var(--space-6));
}

.strip__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.strip__state {
  color: var(--text-on-ink-muted);
}

/* ─── Toggle ─────────────────────────────────────────────────────────── */
.strip__switch {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-pill);
  color: var(--text-on-ink-muted);
  font-family: var(--font-mono);
  font-size: var(--text-utility);
  letter-spacing: var(--tracking-utility);
  text-transform: uppercase;
  /* Revealed once the auto-demo has run; kept in the layout the whole time so
     nothing shifts when it appears (CLS). */
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-standard);
}

.strip__switch.is-ready {
  opacity: 1;
}

.strip__track {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: var(--radius-pill);
  background-color: rgba(242, 243, 240, 0.14);
  border: 1px solid var(--rule-on-ink);
}

.strip__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: var(--radius-pill);
  background-color: var(--redline);
  transition:
    transform var(--duration-base) var(--ease-standard),
    background-color var(--duration-base) var(--ease-standard);
}

.strip__switch[aria-checked='true'] .strip__thumb {
  transform: translateX(18px);
  background-color: var(--seal);
}

.strip__switch[aria-checked='true'] .strip__switch-label:last-child,
.strip__switch[aria-checked='false'] .strip__switch-label:first-child {
  color: var(--text-on-ink);
}

/* ─── Graphic ────────────────────────────────────────────────────────── */
.strip__svg {
  width: 100%;
  height: auto;
}

/* Both layers occupy the same grid cell and crossfade. */
.layer {
  transition: opacity var(--duration-slow) var(--ease-standard);
}

.layer.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.line {
  fill: none;
  stroke-width: 1.5;
}

.line--before {
  stroke: var(--redline);
  stroke-dasharray: 5 5;
}

.line--after {
  stroke: var(--verify);
}

.node {
  stroke-width: 1.5;
}

.node--before {
  fill: var(--ink);
  stroke: var(--redline);
}

.node--after {
  fill: var(--ink);
  stroke: var(--verify);
}

/* The one gold node — the positioning in a single mark. */
.node--human {
  fill: var(--seal);
  stroke: none;
}

.node-ring {
  fill: none;
  stroke: var(--seal);
  stroke-width: 1.5;
  opacity: 0.45;
}

.label {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.label--before,
.label--after {
  fill: var(--muted-on-ink);
}

.label--human {
  fill: var(--seal);
}

/* Friction annotations — redline only ever means cost. */
.stamp {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  fill: var(--redline-text);
}

/* Travelling document token — straight-line loop on the after track only. */
.token {
  fill: var(--seal);
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .layer--after:not(.is-hidden) .token {
    animation: token-run 4.5s var(--ease-standard) infinite;
  }
}

@keyframes token-run {
  0% {
    transform: translate(82px, var(--y));
    opacity: 0;
  }
  8%,
  92% {
    opacity: 1;
  }
  100% {
    transform: translate(897px, var(--y));
    opacity: 0;
  }
}

/* Below ~640px the six-stage track cannot stay legible at width; allow it to
   scroll horizontally inside its own container rather than shrinking the labels
   into illegibility (NFR1 — the page body still must not scroll sideways). */
@media (max-width: 640px) {
  .strip__svg {
    min-width: 620px;
  }

  .strip {
    overflow-x: auto;
  }
}
</style>
