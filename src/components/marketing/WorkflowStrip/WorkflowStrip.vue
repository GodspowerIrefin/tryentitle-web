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
 * - The after-state runs a sheet of paper along the track, stopping AT each of
 *   the six stages and lighting the one it is standing on. It steps rather than
 *   glides because the claim is that a document is handled six times, and a
 *   smooth slide from end to end shows one continuous event instead of six.
 *   The sheet arrives from the hero's incoming routes (see HeroPattern), so the
 *   two together read as one journey: received here, processed there.
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

/**
 * The walk is expressed in CSS — the sheet's stops and each node's lit window
 * are the same six moments seen from two sides, and only a shared timeline can
 * keep them in step. Publishing the layout constants as custom properties keeps
 * the geometry defined once here rather than re-typed as literals in keyframes.
 */
const track = {
  '--x0': `${X0}px`,
  '--gap': `${GAP}px`,
  '--mid': `${MID}px`,
  '--entry': `${X0 - 68}px`,
  /* Arrival plus one per stage — the walk has seven beats, not six. */
  '--steps': String(AFTER_STAGES.length + 1),
} as const

/** Before-state nodes sit at alternating heights so the chain reads as tangled. */
function beforeY(i: number): number {
  return i % 2 === 0 ? MID - 22 : MID + 26
}

const beforeNodes = computed(() =>
  BEFORE_STAGES.map((s, i) => ({ ...s, x: X0 + i * GAP, y: beforeY(i) })),
)
const afterNodes = computed(() => AFTER_STAGES.map((s, i) => ({ ...s, x: X0 + i * GAP, y: MID })))

/** Zig-zag connector through the before nodes. */
const beforePath = computed(() =>
  beforeNodes.value.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' '),
)

const afterPath = computed(() => {
  const first = afterNodes.value[0]
  const last = afterNodes.value[afterNodes.value.length - 1]
  return `M ${first?.x ?? X0} ${MID} L ${last?.x ?? X0} ${MID}`
})

/**
 * Where the document comes FROM. The hero's routes converge on this node from
 * outside the panel and are cut off by its edge; this stub picks the line back
 * up inside and carries it the rest of the way to intake, so the two read as
 * one flow interrupted by an opaque box rather than as two separate graphics.
 */
const ENTRY = X0 - 68
const inboundPath = computed(() => `M ${ENTRY} ${MID} L ${X0} ${MID}`)

const description = computed(() =>
  showAfter.value
    ? 'After: a document moves through six automated stages — intake, extract, validate, human check, route, delivered. The human check is the single point where a person makes a judgment call.'
    : 'Before: a document passes through six manual stages — email inbox, printed, re-keyed, chased, approved, filed — sitting unread, being entered twice, and waiting on approval along the way.',
)

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  <!-- `data-flow-panel` / `data-flow-intake` are read by the hero's decorative
       layer, which measures them so its routes converge on the real intake node
       instead of an assumed position. Nothing here depends on that. -->
  <div class="strip" :style="track" data-flow-panel>
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
          <text v-if="node.stamp" class="stamp" :x="node.x" :y="stampY(node)" text-anchor="middle">
            {{ node.stamp }}
          </text>
        </g>
      </g>

      <!-- ─── After layer ──────────────────────────────────────────── -->
      <g class="layer layer--after" :class="{ 'is-hidden': !showAfter }" :aria-hidden="!showAfter">
        <!-- The stub the hero's routes hand off to. Dashed because it is the
             only segment on this track that is NOT part of the process: it is
             whatever arrived, from wherever it came from. -->
        <path class="line line--inbound" :d="inboundPath" />
        <path class="line line--after" :d="afterPath" />

        <!-- `--i` is the stage's place in the walk; every lit window is the same
             keyframe set delayed by that many steps. -->
        <g
          v-for="(node, i) in afterNodes"
          :key="`a-${node.label}`"
          class="stage"
          :style="{ '--i': i }"
        >
          <template v-if="node.human">
            <circle class="node-ring" :cx="node.x" :cy="node.y" r="22" />
            <circle class="node node--human" :cx="node.x" :cy="node.y" r="13" />
          </template>
          <!-- The anchor goes on the NODE, not the stage group: the group's box
               includes the label beneath it, so its centre sits well below the
               row the hero needs to aim at. -->
          <rect
            v-else
            class="node node--after"
            :x="node.x - 11"
            :y="node.y - 11"
            width="22"
            height="22"
            rx="2"
            :data-flow-intake="i === 0 ? '' : undefined"
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

        <!-- The sheet, drawn around its own centre so the walk is a plain
             translate to each node's x. It rides a lane ABOVE the track rather
             than on it: a sheet this size sitting on a 22px node covers the
             node, and the node lighting up is half of what the walk is saying.
             Last in the layer so it is never clipped by a stage. -->
        <g class="sheet">
          <path class="sheet__page" d="M -12 -16 H 3 L 12 -7 V 16 H -12 Z" />
          <path class="sheet__fold" d="M 3 -16 V -7 H 12" />
          <path class="sheet__rule" d="M -7 -1 H 7 M -7 5 H 3" />
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

/* Not redline — nothing is wrong with the document, it simply has not been
   picked up yet. Graphite is the site's "unprocessed" weight. */
.line--inbound {
  stroke: var(--muted-on-ink);
  stroke-opacity: 0.55;
  stroke-dasharray: 4 5;
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

/* ─── The travelling sheet ───────────────────────────────────────────── */
/*
 * ONE TIMELINE, TWO VIEWS. `--cycle` is the whole walk and `--step` is one
 * stage's share of it; the sheet's stops and each node's lit window are the
 * same six moments, so they are derived from those two values rather than
 * tuned separately. `--x0`, `--gap`, `--mid` and `--stages` come from the
 * script, which owns the layout.
 *
 * The percentages below are the one thing that cannot be derived: CSS keyframe
 * offsets take no calc(). They are a SEVEN-beat split — arrival, then one per
 * stage — at 14.29% each, of which the sheet spends the first 8.9% standing
 * still and the rest hopping. Changing AFTER_STAGES means re-cutting them.
 */
.strip {
  --step: 1.5s;
  --cycle: calc(var(--step) * var(--steps));
  /* The sheet's lane, clear of both the nodes and their labels. The strip is
     drawn at roughly half scale in the panel, so the sheet has to be generous
     in viewBox units to be legible as paper on screen. */
  --lane: calc(var(--mid) - 38px);
}

.sheet {
  opacity: 0;
}

.sheet__page {
  fill: var(--bond);
  stroke: var(--seal);
  stroke-width: 1.5;
}

.sheet__fold,
.sheet__rule {
  fill: none;
  stroke: var(--seal);
  stroke-width: 1.5;
}

@media (prefers-reduced-motion: no-preference) {
  .layer--after:not(.is-hidden) .sheet {
    animation: sheet-walk var(--cycle) var(--ease-standard) infinite;
  }

  /*
   * Every stage runs the same keyframes, offset by its place in the walk —
   * `--i` is set on the group and inherits down to these three. A positive
   * delay means a node simply keeps its resting style until its first turn
   * comes round, which is the correct opening state anyway.
   */
  .layer--after:not(.is-hidden) .stage .node--after {
    animation: stage-node-lit var(--cycle) var(--ease-standard)
      calc((var(--i) + 1) * var(--step)) infinite;
  }

  .layer--after:not(.is-hidden) .stage .node-ring {
    animation: stage-ring-lit var(--cycle) var(--ease-standard) calc((var(--i) + 1) * var(--step))
      infinite;
  }

  /* The human stage's label is already gold — brightening it toward the
     on-ink text colour would read as a downgrade, so it is left alone. */
  .layer--after:not(.is-hidden) .stage .label--after {
    animation: stage-label-lit var(--cycle) var(--ease-standard) calc((var(--i) + 1) * var(--step))
      infinite;
  }
}

/* Arrives on the inbound stub, then stops at all six nodes. */
@keyframes sheet-walk {
  0% {
    transform: translate(var(--entry), var(--lane));
    opacity: 0;
  }
  4%,
  8.9% {
    transform: translate(var(--entry), var(--lane));
    opacity: 1;
  }
  14.29%,
  23.15% {
    transform: translate(var(--x0), var(--lane));
  }
  28.57%,
  37.43% {
    transform: translate(calc(var(--x0) + 1 * var(--gap)), var(--lane));
  }
  42.86%,
  51.72% {
    transform: translate(calc(var(--x0) + 2 * var(--gap)), var(--lane));
  }
  57.14%,
  66% {
    transform: translate(calc(var(--x0) + 3 * var(--gap)), var(--lane));
  }
  71.43%,
  80.29% {
    transform: translate(calc(var(--x0) + 4 * var(--gap)), var(--lane));
  }
  85.71%,
  96% {
    transform: translate(calc(var(--x0) + 5 * var(--gap)), var(--lane));
    opacity: 1;
  }
  100% {
    transform: translate(calc(var(--x0) + 5 * var(--gap)), var(--lane));
    opacity: 0;
  }
}

/*
 * Lit from arrival to departure. The 93.7%→100% ramp is the same hop seen from
 * the receiving end: the node warms as the sheet crosses to it, so the wrap
 * back to 0% is a continuation rather than a jump.
 */
@keyframes stage-node-lit {
  0%,
  8.9% {
    stroke: var(--seal);
    stroke-width: 2.5;
  }
  15%,
  94.57% {
    stroke: var(--verify);
    stroke-width: 1.5;
  }
  100% {
    stroke: var(--seal);
    stroke-width: 2.5;
  }
}

@keyframes stage-ring-lit {
  0%,
  8.9% {
    opacity: 1;
    stroke-width: 2.5;
  }
  15%,
  94.57% {
    opacity: 0.45;
    stroke-width: 1.5;
  }
  100% {
    opacity: 1;
    stroke-width: 2.5;
  }
}

@keyframes stage-label-lit {
  0%,
  8.9% {
    fill: var(--text-on-ink);
  }
  15%,
  94.57% {
    fill: var(--muted-on-ink);
  }
  100% {
    fill: var(--text-on-ink);
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
