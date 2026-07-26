<script setup lang="ts">
/**
 * ExceptionRail — the "how the work flows" diagram (PRD §10.7).
 *
 * A document moves through five numbered stages; at the exception it is pulled
 * out to human review and rejoins the flow. Brass is the only accent and always
 * means "a human is involved" (PRD §10.3). Colours come from tokens via CSS
 * classes so no raw hex lives here (PRD §11.3 rule 5).
 *
 * This is a static inline SVG that needs no JavaScript. It is also the fallback
 * for the 3D WorkflowScene: it is what shows before the 3D chunk loads, when
 * WebGL is unavailable, and under prefers-reduced-motion.
 *
 * Accessibility: one labelled image with a text description of the flow.
 */
withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })

const NODES = [
  { i: '01', label: 'Intake' },
  { i: '02', label: 'Extract' },
  { i: '03', label: 'Validate' },
  { i: '04', label: 'Sync' },
  { i: '05', label: 'Filed' },
] as const

const X0 = 90
const GAP = 180
const BASE_Y = 104
const R = 13 // node half-size

const nodes = NODES.map((n, idx) => ({ ...n, x: X0 + idx * GAP }))

// The exception branches from the space between Validate (idx 2) and Sync (idx 3).
const BRANCH_X = (nodes[2]!.x + nodes[3]!.x) / 2
const SYNC_X = nodes[3]!.x
</script>

<template>
  <svg
    class="rail"
    :class="`rail--${tone}`"
    viewBox="0 0 900 300"
    role="img"
    aria-labelledby="rail-title rail-desc"
    preserveAspectRatio="xMidYMid meet"
  >
    <title id="rail-title">How the work flows</title>
    <desc id="rail-desc">
      A document moves through five automated stages — intake, extract, validate, sync, filed. At
      the exception between validate and sync it is pulled out to a human review step, then rejoins
      the flow.
    </desc>

    <defs>
      <marker
        id="rail-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path class="rail-arrowhead" d="M0,0 L10,5 L0,10 z" />
      </marker>
      <marker
        id="rail-arrow-brass"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path class="rail-arrowhead--brass" d="M0,0 L10,5 L0,10 z" />
      </marker>
    </defs>

    <!-- Flow connectors between consecutive stages -->
    <line
      v-for="(node, idx) in nodes.slice(0, -1)"
      :key="`c${idx}`"
      class="rail-flow"
      :x1="node.x + R + 4"
      :y1="BASE_Y"
      :x2="nodes[idx + 1]!.x - R - 8"
      :y2="BASE_Y"
      marker-end="url(#rail-arrow)"
    />

    <!-- Stage nodes: numbered chips with labels -->
    <g v-for="node in nodes" :key="node.label">
      <rect
        class="rail-node"
        :x="node.x - R"
        :y="BASE_Y - R"
        :width="R * 2"
        :height="R * 2"
        rx="3"
      />
      <circle class="rail-node-dot" :cx="node.x" :cy="BASE_Y" r="3.5" />
      <text class="rail-index" :x="node.x" :y="BASE_Y - R - 16" text-anchor="middle">
        {{ node.i }}
      </text>
      <text class="rail-label" :x="node.x" :y="BASE_Y + R + 26" text-anchor="middle">
        {{ node.label.toUpperCase() }}
      </text>
    </g>

    <!-- The exception: brass junction, branch down to human review, and return -->
    <circle class="rail-junction" :cx="BRANCH_X" :cy="BASE_Y" r="5" />
    <path
      class="rail-branch"
      :d="`M ${BRANCH_X} ${BASE_Y + 6} L ${BRANCH_X} 196`"
      marker-end="url(#rail-arrow-brass)"
    />

    <rect
      class="rail-review"
      :x="BRANCH_X - 92"
      y="202"
      width="184"
      height="44"
      rx="3"
    />
    <circle class="rail-review-dot" :cx="BRANCH_X - 70" cy="224" r="4" />
    <text class="rail-review-text" :x="BRANCH_X + 8" y="229" text-anchor="middle">
      HUMAN REVIEW
    </text>

    <!-- Resolved exceptions rejoin the flow at Sync -->
    <path
      class="rail-return"
      :d="`M ${BRANCH_X + 92} 224 C ${SYNC_X + 70} 224, ${SYNC_X + 62} ${BASE_Y}, ${SYNC_X + R + 10} ${BASE_Y}`"
      marker-end="url(#rail-arrow-brass)"
    />
  </svg>
</template>

<style scoped>
.rail {
  width: 100%;
  height: auto;
  max-width: 680px;
}

/* Dark-stage variant: light strokes/labels on ink; brass stays the accent. */
.rail--dark .rail-flow,
.rail--dark .rail-node {
  stroke: var(--color-graphite-300);
}
.rail--dark .rail-arrowhead {
  fill: var(--color-graphite-300);
}
.rail--dark .rail-node {
  fill: transparent;
}
.rail--dark .rail-label {
  fill: var(--color-rule);
}
.rail--dark .rail-index {
  fill: var(--color-graphite-300);
}

.rail-flow {
  stroke: var(--color-graphite-300);
  stroke-width: 1.5;
}

.rail-arrowhead {
  fill: var(--color-graphite-300);
}

.rail-arrowhead--brass {
  fill: var(--accent-exception);
}

.rail-node {
  fill: var(--bg-surface);
  stroke: var(--text-primary);
  stroke-width: 1.5;
}

.rail-node-dot {
  fill: var(--color-graphite-300);
}

.rail-index {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  fill: var(--text-tertiary);
}

.rail-label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  fill: var(--text-secondary);
}

/* The exception path — brass, non-text (PRD §10.3) */
.rail-junction {
  fill: var(--accent-exception);
}

.rail-branch,
.rail-return {
  fill: none;
  stroke: var(--accent-exception);
  stroke-width: 1.5;
}

.rail-return {
  stroke-dasharray: 4 4;
}

.rail-review {
  fill: var(--accent-exception-bg);
  stroke: var(--accent-exception);
  stroke-width: 1.5;
}

.rail-review-dot {
  fill: var(--accent-exception);
}

.rail-review-text {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  fill: var(--accent-exception-text);
}
</style>
