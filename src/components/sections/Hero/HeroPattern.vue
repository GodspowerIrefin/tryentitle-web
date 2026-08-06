<script setup lang="ts">
/**
 * HeroPattern — the flow into intake.
 *
 * Scattered inputs enter from off the left edge, CONVERGE ON A SINGLE GATE, and
 * run one trunk line into the workflow panel — aimed at its INTAKE node, where
 * the strip picks the same line back up and walks it through the six stages.
 * The whole hero is therefore one diagram read left to right: many sources, one
 * door, one process. That is the product argument drawn rather than stated.
 *
 * WHY THE INPUT SIDE IS DELIBERATELY UNTIDY
 *
 * The argument only lands if the two halves LOOK different. A neat symmetrical
 * fan into a neat trunk says "this was always orderly"; what the product does is
 * take work that arrives loose — different senders, different moments, no shared
 * shape — and give it one door. So each feeder wanders through its own waypoint
 * on the way in: they enter at unrelated points, bow by different amounts, cross
 * one another, and carry slightly different weights. Past the gate every one of
 * those irregularities is gone and there is a single square-cornered trunk. Few
 * lines, though — four loose ones read as scattered, a dozen read as noise.
 *
 * The panel is opaque and paints above this layer, so the trunk is cut off at
 * its edge rather than stopping there. The strip's own dashed inbound stub
 * continues it inside, which is what keeps the two halves reading as one flow
 * interrupted by a box.
 *
 * WHY THE INTAKE POSITION IS MEASURED
 *
 * A route "aimed at intake" that is actually aimed at a hard-coded fraction of
 * the hero stops being aimed at anything the moment the grid, the panel padding
 * or the type metrics move. So this layer measures the real node — the strip
 * publishes `data-flow-intake` and `data-flow-panel` for exactly this — and
 * rebuilds its geometry from that point. Reaching across components is the
 * concession; a decorative layer that silently drifts out of alignment is the
 * alternative, and it is worse.
 *
 * WHY THE GEOMETRY IS COMPUTED RATHER THAN AUTHORED
 *
 * The hero's aspect ratio swings from ~2.4:1 on a desktop to ~0.5:1 on a phone.
 * A fixed viewBox has to pick a poison: `preserveAspectRatio="none"` stretches
 * the coordinate system, which is survivable for bare curves but turns a sheet
 * of paper into a squat card or a sliver; `slice` keeps it square but crops the
 * composition away at one end. So the viewBox is the element's own pixel box,
 * measured with a ResizeObserver, and everything is derived from it in px. One
 * user unit is one CSS pixel at every size, and the glyphs stay square.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Vec {
  x: number
  y: number
}

/**
 * The loose half of the diagram.
 *
 *  `x`      where the input enters, as a fraction of the hero's width.
 *  `from`   which edge it enters by. A route entering from the side has to
 *           leave horizontally and one dropping in from the top has to leave
 *           vertically, or the fan kinks at its first control point.
 *  `enter`  a side feeder's lane at the moment it enters; a top feeder's is
 *           fixed by the edge, so for those it reads as how far ABOVE the
 *           canvas it starts, which is what sets its approach angle.
 *  `mid`    how far along the run to the gate its waypoint sits.
 *  `lane`   which lane that waypoint sits in. Together with `mid` this is the
 *           whole scatter: no two feeders share a lane or a waypoint, so they
 *           bow apart and cross instead of nesting into a tidy fan.
 *  `slack`  how lazily the first leg leaves its edge — low is a hard turn, high
 *           is a long glide, and mixing them stops the entries rhyming.
 *  `weight` stroke width. Real inbound work is not uniform, and a hair of
 *           variation is what keeps four lines from reading as one ruled set.
 *
 * A LANE is a fraction of the open band above the copy — 0 at the top edge of
 * the hero, 1 just clear of the headline. Lanes rather than fractions of the
 * hero's height because that band is the whole stage this half of the diagram
 * plays on, it is only ~60px tall on a laptop, and it moves whenever the type
 * reflows. Scatter measured against the box instead would either waste the room
 * or, at the first narrow viewport, put a line through the H1.
 */
const FEEDERS = [
  { x: -0.09, from: 'side', enter: 0.06, mid: 0.5, lane: 0.34, slack: 0.66, weight: 1.2, dur: 9.5, start: 0 }, // prettier-ignore
  { x: -0.07, from: 'side', enter: 0.78, mid: 0.44, lane: 1, slack: 0.28, weight: 0.95, dur: 12.6, start: 0.3 }, // prettier-ignore
  { x: 0.085, from: 'top', enter: 0.85, mid: 0.58, lane: 0.66, slack: 0.55, weight: 1.05, dur: 10.8, start: 0.54 }, // prettier-ignore
  { x: 0.355, from: 'top', enter: 0.2, mid: 0.52, lane: 0.14, slack: 0.78, weight: 0.85, dur: 8.4, start: 0.79 }, // prettier-ignore
] as const

/**
 * Trail length, as a percentage of the route — every path declares
 * `pathLength="100"`, so dash maths is in percent and survives any resize.
 *
 * A quarter of the route reads as a comet; much shorter is a dash chasing the
 * sheet, much longer and the whole route is lit and the motion stops reading.
 */
const TRAIL = 26

/** One lit segment per 100 units of path, so exactly one comet runs per sheet. */
const dash = `${TRAIL} ${100 - TRAIL}`

const root = ref<HTMLElement | null>(null)
/* Seeded with a plausible desktop hero so the first paint is not degenerate. */
const w = ref(1440)
const h = ref(720)
const intake = ref<Vec | null>(null)
const panel = ref<Vec | null>(null)
/** Top of the copy column — the floor of the band the scatter plays in. */
const copyTop = ref<number | null>(null)

let observer: ResizeObserver | undefined
let settleHost: HTMLElement | null = null

/**
 * SMIL drives the motion, and SMIL has no media queries — so the preference is
 * read once here and the animation elements are simply not rendered when it is
 * set. Read as a plain value, not a live listener: a visitor who flips the OS
 * setting mid-session gets the new behaviour on the next navigation, and the
 * alternative is a listener on every hero for a change that essentially never
 * happens while a page is open.
 */
const still = ref(false)

/** Re-reads the box, the intake node and the copy — they only move as one. */
function measure(): void {
  const el = root.value
  if (!el) return

  const host = el.getBoundingClientRect()
  if (host.width < 1 || host.height < 1) return
  w.value = host.width
  h.value = host.height

  /* Scoped to this hero: `.strip` also appears elsewhere on the site, and a
     querySelector on the whole document would happily aim at the wrong one. */
  const scope = el.closest('section')
  const node = scope?.querySelector('[data-flow-intake]')
  const box = scope?.querySelector('[data-flow-panel]')
  const text = scope?.querySelector('[data-flow-copy]')

  if (node) {
    const r = node.getBoundingClientRect()
    intake.value = { x: r.left + r.width / 2 - host.left, y: r.top + r.height / 2 - host.top }
  }
  if (box) {
    const r = box.getBoundingClientRect()
    panel.value = { x: r.left - host.left, y: r.top - host.top }
  }
  if (text) {
    copyTop.value = text.getBoundingClientRect().top - host.top
  }
}

onMounted(() => {
  still.value =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const el = root.value
  if (!el) return

  measure()
  /* The strip's own layout is not final until the next frame, and web fonts
     reflow the copy column under it after that. */
  requestAnimationFrame(measure)
  void (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(measure))

  /*
   * The hero reveals its panel with a `translateY(10px) -> 0` transition, and a
   * transform fires no ResizeObserver — so a measurement taken during the
   * reveal is permanently 10px low with nothing to correct it. Re-measuring
   * whenever anything in the hero finishes transitioning fixes that without
   * guessing at a settling delay.
   */
  settleHost = el.closest('section')
  settleHost?.addEventListener('transitionend', measure)

  if (typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => measure())
  observer.observe(el)
  const box = settleHost?.querySelector('[data-flow-panel]')
  if (box) observer.observe(box)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  settleHost?.removeEventListener('transitionend', measure)
})

/**
 * The whole composition, rebuilt whenever the box or the intake node moves.
 *
 * The gate is placed in whichever open ground the layout leaves. On the
 * two-column desktop the panel sits to the right, so the gate goes above and to
 * the left of it; once the layout stacks, the panel spans the full width and
 * the only room left is the strip immediately above it.
 */
const flow = computed(() => {
  const W = w.value
  const H = h.value
  const n = (v: number) => v.toFixed(1)

  /* Fallbacks are the desktop layout's own proportions — used for the first
     paint and if the strip is ever absent, never for a measured hero. */
  const I: Vec = intake.value ?? { x: W * 0.55, y: H * 0.55 }
  const P: Vec = panel.value ?? { x: W * 0.5, y: H * 0.32 }

  const stacked = P.x <= W * 0.3

  /*
   * Desktop: the gate sits in the corridor between the copy column and the
   * panel, high enough to clear the headline. Stacked: there is no corridor, so
   * it goes in the band directly above the panel and slightly to the left of
   * intake — slightly, because a perfectly vertical trunk has a zero-width
   * bounding box and an object-bounding-box gradient cannot paint one.
   */
  const gate: Vec = stacked
    ? { x: Math.max(W * 0.06, I.x - W * 0.12), y: P.y - H * 0.04 }
    : { x: P.x - 26, y: Math.max(H * 0.055, P.y - H * 0.22) }

  /*
   * AN ELBOW, NOT A SWOOP. The trunk has to reach intake's row BEFORE it
   * crosses the panel edge, or it disappears behind the corner well above the
   * node and never visibly meets the strip's inbound stub. Between the copy and
   * the panel there is only ~60px of corridor to lose 250px of height in, which
   * no smooth cubic can do gracefully — so it drops straight down the corridor,
   * turns a rounded corner, and runs in flat at intake's height. That is also
   * the right dialect: right angles and a fillet are what a plan drawing does,
   * and after the gate this diagram is supposed to look drawn.
   */
  const dx = I.x - gate.x
  const dy = I.y - gate.y
  const r = Math.max(4, Math.min(30, dy * 0.35, dx * 0.5))
  const tail = stacked
    ? ` L ${n(I.x)} ${n(I.y)}`
    : ` L ${n(gate.x)} ${n(I.y - r)} Q ${n(gate.x)} ${n(I.y)} ${n(gate.x + r)} ${n(I.y)}` +
      ` L ${n(I.x)} ${n(I.y)}`

  /*
   * The band the scatter plays in, and the lane function that indexes it.
   *
   * The wander is free to be untidy but not free to be anywhere: the middle of
   * every feeder's run is horizontally on top of the copy column, so a route
   * that strays below the top of the copy is a line through the headline. The
   * floor is therefore the measured copy, held off by a clear 18px, and the
   * ceiling is inset from the hero's own top edge so a route near lane 0 reads
   * as running along the top rather than as clipped by it.
   */
  const ceiling = H * 0.02
  const bed = Math.max(ceiling + 12, (copyTop.value ?? H * 0.2) - 18)
  const lane = (t: number) => ceiling + (bed - ceiling) * t

  /* On a phone the fan has nowhere to go — the copy runs full width and the CTA
     sits directly above the panel — so the inputs are dropped and the trunk
     alone feeds intake. */
  const feeders = stacked
    ? []
    : FEEDERS.map((f) => {
        /* A top feeder starts above the canvas, deep enough that `enter` still
           buys it a visibly different approach angle from its neighbour. */
        const E: Vec =
          f.from === 'side'
            ? { x: f.x * W, y: lane(f.enter) }
            : { x: f.x * W, y: -H * (0.04 + 0.06 * f.enter) }

        /* The kink that makes this route its own. */
        const M: Vec = { x: E.x + (gate.x - E.x) * f.mid, y: lane(f.lane) }

        /* Leg one: off the edge, in the direction that edge implies, into M. */
        const a1: Vec =
          f.from === 'side'
            ? { x: E.x + (M.x - E.x) * f.slack, y: E.y }
            : { x: E.x, y: E.y + (M.y - E.y) * f.slack }
        const a2: Vec = { x: M.x - (M.x - E.x) * 0.35, y: M.y }

        /* Leg two: out of M and into the gate FLAT, which is the one thing every
           feeder does the same way — otherwise they arrive at a shared point
           from four unrelated angles and the gate reads as a collision. */
        const b1: Vec = { x: M.x + (gate.x - M.x) * 0.45, y: M.y }
        const b2: Vec = { x: gate.x - (gate.x - M.x) * 0.18, y: gate.y }

        const d =
          `M ${n(E.x)} ${n(E.y)} C ${n(a1.x)} ${n(a1.y)}, ${n(a2.x)} ${n(a2.y)}, ${n(M.x)} ${n(M.y)}` +
          ` C ${n(b1.x)} ${n(b1.y)}, ${n(b2.x)} ${n(b2.y)}, ${n(gate.x)} ${n(gate.y)}`

        return { d, dur: f.dur, start: f.start, weight: f.weight }
      })

  /* Each sheet rides one input all the way in; with no inputs they queue on the
     trunk itself, staggered so they do not overlap. */
  const legs = feeders.length
    ? feeders.map((f) => ({ d: `${f.d}${tail}`, dur: f.dur, start: f.start }))
    : FEEDERS.map((f) => ({ d: `M ${n(gate.x)} ${n(gate.y)}${tail}`, dur: f.dur, start: f.start }))

  return {
    gate,
    feeders,
    /* Published so the gradients can ramp to full warmth exactly at intake. */
    aim: I,
    /* Drawn once. Every sheet travels it, but stroking it per sheet would stack
       four copies of the same line and quadruple its weight. */
    trunk: `M ${n(gate.x)} ${n(gate.y)}${tail}`,
    /* Feeder + trunk as one path: the motion and the comet both need the whole
       journey, not the leg the sheet happens to be on. */
    sheets: legs.map((f, i) => {
      /* Where the sheet is parked when motion is off — spread along the fan so
         the still frame reads as traffic held rather than a pile-up. */
      const restT = 0.3 + i * 0.15
      return {
        key: `s-${i}`,
        d: f.d,
        dur: `${f.dur}s`,
        /* Negative begin = already under way, so the field is populated on the
           first frame instead of staggering in over the first cycle. */
        begin: `${(-f.dur * f.start).toFixed(2)}s`,
        restT: restT.toFixed(3),
        restOffset: (100 + TRAIL - 100 * restT).toFixed(1),
      }
    }),
  }
})

/**
 * Dash offset that puts a trail's LEADING EDGE at path fraction `t`.
 *
 * With `stroke-dasharray: TRAIL (100 - TRAIL)` the visible dash spans
 * `[100 - offset, 100 - offset + TRAIL]`. Setting the top of that range to
 * `100t` and solving gives `100 + TRAIL - 100t`, so an offset sweeping from
 * `100 + TRAIL` down to `TRAIL` walks the trail from entirely-before-the-path
 * to flush with its end.
 */
const trailFrom = 100 + TRAIL
const trailTo = TRAIL
</script>

<template>
  <div ref="root" class="pattern" aria-hidden="true">
    <div class="pattern__wash pattern__wash--seal" />
    <div class="pattern__wash pattern__wash--verify" />

    <svg class="pattern__svg" :viewBox="`0 0 ${w} ${h}`" preserveAspectRatio="none">
      <defs>
        <!--
          ONE RAMP ACROSS THE CANVAS, from the left edge to intake — not one per
          path. Warmth is a property of how close you are to the process, so it
          has to be measured against the hero, and object-bounding-box units
          measure each path against itself: the trunk drops almost vertically,
          its box is ~100px wide, and its whole visible length would collapse
          onto the transparent end of its own gradient.

          The paint is therefore fixed to the canvas and the traffic moves
          through it, which is the trick that makes a sheet's colour state its
          progress with nothing recomputed per frame.

          The stops carry `style` rather than `stop-color` attributes: a token
          reference has to be resolved as a CSS value, and `var()` inside an SVG
          presentation attribute is not honoured across browsers.
        -->
        <linearGradient
          id="hero-route"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          :x2="flow.aim.x"
          y2="0"
        >
          <stop offset="0%" style="stop-color: var(--graphite); stop-opacity: 0" />
          <stop offset="22%" style="stop-color: var(--graphite); stop-opacity: 0.22" />
          <stop offset="70%" style="stop-color: var(--graphite); stop-opacity: 0.3" />
          <stop offset="100%" style="stop-color: var(--seal); stop-opacity: 0.5" />
        </linearGradient>

        <linearGradient
          id="hero-trail"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          :x2="flow.aim.x"
          y2="0"
        >
          <stop offset="0%" style="stop-color: var(--verify); stop-opacity: 0" />
          <stop offset="20%" style="stop-color: var(--verify); stop-opacity: 0.55" />
          <stop offset="70%" style="stop-color: var(--seal); stop-opacity: 0.9" />
          <stop offset="100%" style="stop-color: var(--seal); stop-opacity: 1" />
        </linearGradient>
      </defs>

      <!-- Inputs, then the one line they become. The trunk draws last so the
           entry reads in the right order: sources first, then the way in. -->
      <path
        v-for="(feeder, i) in flow.feeders"
        :key="`feeder-${i}`"
        class="pattern__route"
        :d="feeder.d"
        pathLength="100"
        :style="{ '--weight': feeder.weight, animationDelay: `${i * 130}ms` }"
      />
      <path
        class="pattern__route pattern__route--trunk"
        :d="flow.trunk"
        pathLength="100"
        style="animation-delay: 620ms"
      />

      <!-- The gate. A junction mark is what turns four lines that happen to
           meet into a place where things are collected — so it is only drawn
           when there is actually something to collect. -->
      <template v-if="flow.feeders.length">
        <circle class="pattern__gate-ring" :cx="flow.gate.x" :cy="flow.gate.y" r="9" />
        <circle class="pattern__gate" :cx="flow.gate.x" :cy="flow.gate.y" r="3" />
      </template>

      <g class="pattern__traffic" :class="{ 'is-still': still }">
        <!--
          Trail and sheet are the same journey drawn twice, and they must not
          drift by so much as a frame or the comet detaches from the paper. Both
          are therefore driven by SMIL off the one document timeline with an
          identical `dur` and `begin` — a CSS animation here would start its
          clock at first style resolution rather than at SVG load, which is a
          small but permanent offset.

          `animateMotion` defaults to `calcMode="paced"`, i.e. uniform in ARC
          LENGTH, which is what makes it agree with a dash offset. Asking for
          `linear` would pace uniformly in the curve's parameter instead and the
          two would disagree wherever the cubic is not evenly parameterised.
        -->
        <path
          v-for="sheet in flow.sheets"
          :key="`trail-${sheet.key}`"
          class="pattern__trail"
          :d="sheet.d"
          pathLength="100"
          :stroke-dasharray="dash"
          :stroke-dashoffset="sheet.restOffset"
        >
          <animate
            v-if="!still"
            attributeName="stroke-dashoffset"
            :from="trailFrom"
            :to="trailTo"
            :dur="sheet.dur"
            :begin="sheet.begin"
            repeatCount="indefinite"
          />
        </path>

        <!-- Each sheet is drawn around its own centre, so the motion path
             carries it by the middle rather than by a corner. -->
        <g
          v-for="sheet in flow.sheets"
          :key="`sheet-${sheet.key}`"
          class="pattern__sheet"
          :style="{ '--dur': sheet.dur, '--delay': sheet.begin }"
        >
          <path class="sheet__page" d="M -10 -13 H 3 L 10 -6 V 13 H -10 Z" />
          <path class="sheet__fold" d="M 3 -13 V -6 H 10" />
          <path class="sheet__rule" d="M -5 0 H 5 M -5 6 H 2" />
          <animateMotion
            v-if="!still"
            :path="sheet.d"
            :dur="sheet.dur"
            :begin="sheet.begin"
            repeatCount="indefinite"
          />
          <!-- Reduced motion: parked partway along, so the still frame reads as
               traffic held rather than as an empty diagram. Two identical
               keyPoints is how SMIL expresses "sit at this fraction of the
               path" — there is no static equivalent of `animateMotion`. -->
          <animateMotion
            v-else
            :path="sheet.d"
            dur="1s"
            :keyPoints="`${sheet.restT};${sheet.restT}`"
            keyTimes="0;1"
            calcMode="linear"
            fill="freeze"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.pattern {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* ─── Ambient washes ─────────────────────────────────────────────────── */
/*
 * Kept deliberately weak. `--seal-wash` is a warm tint on the off-white ground,
 * so at any real strength it stops reading as light and starts reading as a
 * stain on the page — the opposite of what a company selling precise paperwork
 * wants behind its headline.
 */
.pattern__wash {
  position: absolute;
  border-radius: 50%;
}

.pattern__wash--seal {
  top: -46%;
  right: -6%;
  width: 58vmax;
  height: 58vmax;
  background: radial-gradient(circle, var(--seal-wash) 0%, transparent 62%);
  opacity: 0.42;
}

.pattern__wash--verify {
  right: -18%;
  bottom: -34%;
  width: 46vmax;
  height: 46vmax;
  background: radial-gradient(circle, var(--verify-wash) 0%, transparent 66%);
  opacity: 0.45;
}

/* ─── Routes and traffic ─────────────────────────────────────────────── */
/*
 * A short mask, because the route gradient already fades its own left end. This
 * exists for the SHEETS, which would otherwise be sliced in half by the SVG
 * viewport as they enter.
 */
.pattern__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mask-image: linear-gradient(90deg, transparent 1%, #000 9%);
  -webkit-mask-image: linear-gradient(90deg, transparent 1%, #000 9%);
}

.pattern__route {
  fill: none;
  stroke: url(#hero-route);
  /* Per-feeder, so the inbound set is not a ruled family. The trunk overrides. */
  stroke-width: var(--weight, 1.1);
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
}

/* Carries four inputs' worth of traffic, so it reads a step heavier than the
   heaviest of them. */
.pattern__route--trunk {
  stroke-width: 1.6;
}

.pattern__gate {
  fill: var(--seal);
  opacity: 0.55;
}

.pattern__gate-ring {
  fill: none;
  stroke: var(--seal);
  stroke-width: 1;
  opacity: 0.3;
}

.pattern__trail {
  fill: none;
  stroke: url(#hero-trail);
  stroke-width: 1.75;
  stroke-linecap: round;
  /* `stroke-dasharray` and `stroke-dashoffset` are left to attributes: the dash
     maths belongs to TRAIL, and a CSS declaration here would outrank both the
     bound value and SMIL's animation of it. */
}

/* White stock on a cool bond ground: the sheet has to be lighter than the page
   to read as paper ON paper, which only leaves the outline to carry the shape. */
.sheet__page {
  fill: var(--bond-raised);
  stroke: var(--graphite);
  stroke-opacity: 0.55;
  stroke-width: 1;
}

.sheet__fold,
.sheet__rule {
  fill: none;
  stroke: var(--graphite);
  stroke-opacity: 0.5;
  stroke-width: 1;
}

/* ─── Motion ─────────────────────────────────────────────────────────── */
.pattern__traffic {
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  /* Drawn in once, left to right, so the field is built rather than switched
     on. `both` holds the pre-draw state through the delay and the drawn state
     afterwards. */
  .pattern__route {
    stroke-dashoffset: 100;
    animation: hero-route-draw 1100ms var(--ease-standard) both;
  }

  .pattern__gate,
  .pattern__gate-ring {
    animation: hero-gate-in 500ms var(--ease-standard) 700ms both;
  }

  /* Traffic arrives behind the finished routes — a sheet already mid-flight on
     a half-drawn route reads as a glitch. */
  .pattern__traffic {
    animation: hero-traffic-in 800ms var(--ease-standard) 1500ms both;
  }

  /*
   * SMIL moves the sheet; CSS only fades and warms it. Splitting them this way
   * keeps each on properties the other never touches. The pairing is loose on
   * purpose — unlike the trail, a fade and a colour ramp are both slow enough
   * that a few frames of clock skew between the CSS and SMIL timelines is
   * invisible, so they can take the negative delay and stay near enough.
   */
  .pattern__sheet {
    animation: hero-sheet-fade var(--dur) linear var(--delay) infinite;
  }

  .pattern__sheet .sheet__page,
  .pattern__sheet .sheet__fold,
  .pattern__sheet .sheet__rule {
    animation: hero-sheet-warm var(--dur) linear var(--delay) infinite;
  }

  .pattern__wash--seal {
    animation: hero-wash-seal 30s var(--ease-standard) infinite alternate;
  }

  .pattern__wash--verify {
    animation: hero-wash-verify 38s var(--ease-standard) infinite alternate;
  }
}

/* Reduced motion: the still frame. Each sheet is frozen partway along its route
   by a `fill="freeze"` motion instead of a running one. */
.pattern__traffic.is-still,
.pattern__traffic.is-still .pattern__sheet,
.pattern__traffic.is-still .pattern__sheet * {
  animation: none;
  opacity: 1;
}

@keyframes hero-route-draw {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes hero-gate-in {
  from {
    opacity: 0;
  }
}

@keyframes hero-traffic-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/*
 * Held back until the sheet has cleared the viewport edge — a feeder's first
 * stretch is off-canvas, so fading in any earlier just means the sheet appears
 * already sliced by the left edge. It stays lit to the end, because the last
 * stretch is behind the panel and the sheet is occluded before the loop wraps.
 */
@keyframes hero-sheet-fade {
  0%,
  7% {
    opacity: 0;
  }
  20%,
  100% {
    opacity: 0.92;
  }
}

/* The same ramp the gradients paint, applied to the paper itself. */
@keyframes hero-sheet-warm {
  0%,
  26% {
    stroke: var(--graphite);
  }
  100% {
    stroke: var(--seal);
  }
}

@keyframes hero-wash-seal {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(-4%, 6%) scale(1.08);
  }
}

@keyframes hero-wash-verify {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(5%, -5%) scale(1.06);
  }
}

/*
 * Below the desktop breakpoint the copy runs full width with the panel beneath
 * it. The gate moves to the strip of ground directly above the panel, which is
 * the only room the stacked layout leaves — so the mask only has to keep the
 * fan off the copy sitting above THAT.
 */
@media (max-width: 999px) {
  .pattern__svg {
    mask-image: linear-gradient(180deg, transparent 46%, #000 62%);
    -webkit-mask-image: linear-gradient(180deg, transparent 46%, #000 62%);
  }
}
</style>
