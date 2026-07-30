<script setup lang="ts">
/**
 * HeroScene — the paper trail, in depth.
 *
 * A trail wraps the workflow panel — across the top margin, down the right
 * edge, back along the bottom — and a queue of document sheets travels it on a
 * loop. One sheet is the exception: it carries the seal and brightens as it
 * passes the ring where a person is standing. The argument of the product,
 * running quietly behind the copy.
 *
 * This replaces a field of static boxes, which at hero scale were
 * indistinguishable from dust on the screen.
 *
 * THE COMPOSITION IS SPECIFIED IN SCREEN FRACTIONS, NOT WORLD UNITS.
 *
 * The hero's open ground is defined by the DOM: the copy owns the left, the
 * workflow panel owns the middle right, and what is left over is the top strip,
 * the right margin and the bottom strip. A trail authored in world units has no
 * way to know that — the previous one sat dead centre, which is to say entirely
 * behind the copy and the panel, and could not be seen at all. Authoring the
 * control points as fractions of the viewport and projecting them at the
 * camera's plane means the trail lands in the open ground at every aspect
 * ratio, and it stays there when the hero reflows.
 *
 * Rules this scene inherits (PRD §11.3 rule 5, NFR2): colours come from tokens,
 * never hex; the whole thing is lazily built, paused offscreen, and disposed by
 * `useThreeScene`; under `prefers-reduced-motion` it never boots at all and the
 * inline SVG below stays on screen.
 */
import { ref } from 'vue'
import { useThreeScene, type SceneContext, type SceneController } from '@/lib/three/useThreeScene'
import { tokenColor } from '@/lib/three/palette'

const canvas = ref<HTMLCanvasElement | null>(null)

/** Sheets on the trail. Enough to read as a queue, few enough to stay cheap. */
const SHEETS = 13
/** Seconds for one sheet to travel the whole trail. */
const TRAVEL = 30
/**
 * Where on the trail the human-review ring sits. Kept in the middle of the top
 * run: the ring is the widest thing in the scene and needs headroom on both
 * sides of the curve or the hero's top edge crops it.
 */
const CHECKPOINT = 0.36

/**
 * The trail, as [x, y, depth] where x and y are fractions of the viewport
 * (0,0 = top left) and depth is in world units toward/away from the camera.
 * Traced to wrap the panel: top strip → right margin → bottom strip.
 */
const ROUTE: readonly [number, number, number][] = [
  [0.25, 0.27, -1.5],
  [0.42, 0.17, -0.7],
  [0.6, 0.12, 0.3],
  [0.79, 0.17, 0.6],
  [0.93, 0.33, 0.1],
  [0.98, 0.6, -0.5],
  [0.88, 0.82, -1.0],
  [0.64, 0.9, -1.5],
]

function build({ THREE, scene, camera, renderer, width, height }: SceneContext): SceneController {
  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(o: T): T => (disposables.push(o), o)

  renderer.setClearColor(0x000000, 0)

  const curve = new THREE.CatmullRomCurve3(ROUTE.map(() => new THREE.Vector3()))

  /** World half-extents of the camera's view at z = 0. Set by `fit`. */
  let halfW = 1
  let halfH = 1

  function fit(aspect: number) {
    const halfTan = Math.tan(((camera.fov || 36) * Math.PI) / 180 / 2)
    const z = Math.max(3.6 / halfTan, 6.4)
    camera.position.set(0, 0, z)
    camera.lookAt(0, 0, 0)

    halfH = halfTan * z
    halfW = halfH * aspect

    // Re-project the route so the trail keeps hugging the panel when the hero
    // reflows, rather than drifting under it.
    for (let i = 0; i < ROUTE.length; i++) {
      const [u, v, d] = ROUTE[i]!
      curve.points[i]!.set((u - 0.5) * 2 * halfW, (0.5 - v) * 2 * halfH, d)
    }
    curve.updateArcLengths()
  }
  fit(width / height)

  const seal = tokenColor(THREE, 'seal')
  const graphite = tokenColor(THREE, 'graphite')
  const verify = tokenColor(THREE, 'verify')
  const ink = tokenColor(THREE, 'ink')

  const group = new THREE.Group()
  scene.add(group)

  /* ─── The trail ────────────────────────────────────────────────────── */
  const railGeo = track(new THREE.BufferGeometry())
  const railMat = track(
    new THREE.LineBasicMaterial({ color: graphite, transparent: true, opacity: 0.28 }),
  )
  const rail = new THREE.Line(railGeo, railMat)
  group.add(rail)

  function redrawRail() {
    railGeo.setFromPoints(curve.getPoints(240))
  }
  redrawRail()

  /* ─── Sheets ───────────────────────────────────────────────────────── */
  // Unit-sized and scaled per frame, so one geometry serves every sheet at
  // every viewport size. 13 meshes, two geometries.
  const faceGeo = track(new THREE.PlaneGeometry(1, 1))
  const edgeGeo = track(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5, -0.5, 0),
      new THREE.Vector3(0.5, -0.5, 0),
      new THREE.Vector3(0.5, 0.5, 0),
      new THREE.Vector3(-0.5, 0.5, 0),
      new THREE.Vector3(-0.5, -0.5, 0),
    ]),
  )

  interface Sheet {
    pivot: import('three').Group
    faceMat: import('three').MeshBasicMaterial
    edgeMat: import('three').LineBasicMaterial
    /** Offset along the trail, 0–1. */
    seed: number
    /** Individual roll, so the queue never looks stamped. */
    roll: number
    isException: boolean
  }

  const sheets: Sheet[] = []
  /** One sheet in the queue is the exception a person has to look at. */
  const exceptionIndex = 4

  for (let i = 0; i < SHEETS; i++) {
    const isException = i === exceptionIndex
    const pivot = new THREE.Group()

    const faceMat = track(
      new THREE.MeshBasicMaterial({
        color: isException ? seal : ink,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    )
    const edgeMat = track(
      new THREE.LineBasicMaterial({
        color: isException ? seal : graphite,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    )

    pivot.add(new THREE.Mesh(faceGeo, faceMat), new THREE.Line(edgeGeo, edgeMat))
    group.add(pivot)

    sheets.push({
      pivot,
      faceMat,
      edgeMat,
      seed: i / SHEETS,
      roll: (i % 5) * 0.05 - 0.1,
      isException,
    })
  }

  /* ─── The checkpoint a person owns ─────────────────────────────────── */
  const ringGeo = track(new THREE.RingGeometry(0.86, 0.9, 64))
  const ringMat = track(
    new THREE.MeshBasicMaterial({
      color: seal,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  const ring = new THREE.Mesh(ringGeo, ringMat)
  group.add(ring)

  const dotGeo = track(new THREE.CircleGeometry(0.1, 24))
  const dotMat = track(
    new THREE.MeshBasicMaterial({ color: verify, transparent: true, opacity: 0.8 }),
  )
  const dot = new THREE.Mesh(dotGeo, dotMat)
  group.add(dot)

  /* ─── Pointer parallax ─────────────────────────────────────────────── */
  const aim = { x: 0, y: 0 }
  function onPointer(e: PointerEvent) {
    aim.x = (e.clientX / window.innerWidth) * 2 - 1
    aim.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  /** Fade a sheet in and out at the ends so none of them pop into existence. */
  function edgeFade(t: number): number {
    return Math.min(1, t / 0.1, (1 - t) / 0.1)
  }

  /** Positive modulo into [0, 1). */
  function wrap01(v: number): number {
    return ((v % 1) + 1) % 1
  }

  const checkpointAt = new THREE.Vector3()

  return {
    update(elapsed) {
      // A whole-group rotation would swing the trail off the open ground it was
      // placed on, so the parallax is a small translation instead.
      group.position.x += (aim.x * -0.16 - group.position.x) * 0.04
      group.position.y += (aim.y * 0.1 - group.position.y) * 0.04

      // Sheets are sized off the viewport so they read the same on a phone and
      // an ultrawide.
      const sheetH = halfH * 0.075
      const sheetW = sheetH * 0.76

      for (const sheet of sheets) {
        // `%` keeps the sign of its left operand, so wrap rather than assume:
        // `getPointAt` indexes its control points and a negative t reads past
        // the start of the array.
        const t = wrap01(sheet.seed + elapsed / TRAVEL)

        curve.getPointAt(t, sheet.pivot.position)

        // Billboard toward the camera, then roll — sheets stay legible instead
        // of turning edge-on and vanishing.
        sheet.pivot.quaternion.copy(camera.quaternion)
        sheet.pivot.rotateZ(sheet.roll + Math.sin(elapsed * 0.4 + sheet.seed * 9) * 0.06)

        const atCheck = 1 - Math.min(1, Math.abs(t - CHECKPOINT) / 0.08)
        const scale = 1 + (sheet.isException ? 0.34 + atCheck * 0.22 : atCheck * 0.06)
        sheet.pivot.scale.set(sheetW * scale, sheetH * scale, 1)

        const fade = edgeFade(t)
        sheet.faceMat.opacity = fade * (sheet.isException ? 0.18 + atCheck * 0.16 : 0.07)
        sheet.edgeMat.opacity = fade * (sheet.isException ? 0.8 : 0.4 + atCheck * 0.18)
      }

      curve.getPointAt(CHECKPOINT, checkpointAt)
      ring.position.copy(checkpointAt)
      dot.position.copy(checkpointAt)
      ring.quaternion.copy(camera.quaternion)
      dot.quaternion.copy(camera.quaternion)

      const breathe = (Math.sin(elapsed * 1.1) + 1) / 2
      const ringScale = sheetH * (1.5 + breathe * 0.18)
      ring.scale.setScalar(ringScale)
      dot.scale.setScalar(sheetH * 0.5)
      ringMat.opacity = 0.3 + breathe * 0.3

      renderer.render(scene, camera)
    },
    resize(w, h) {
      fit(w / h)
      redrawRail()
    },
    dispose() {
      window.removeEventListener('pointermove', onPointer)
      for (const d of disposables) d.dispose()
    },
  }
}

const { active } = useThreeScene(canvas, build, {
  fov: 36,
  cameraZ: 8,
  alpha: true,
  rootMargin: '0px',
})
</script>

<template>
  <div class="hero-scene" aria-hidden="true">
    <canvas ref="canvas" class="hero-scene__canvas" :class="{ 'is-active': active }" />

    <!--
      Shown until (or instead of) the 3D layer: reduced motion, no WebGL, a
      failed chunk. Same composition, held still.
    -->
    <svg
      class="hero-scene__fallback"
      :class="{ 'is-replaced': active }"
      viewBox="0 0 1000 620"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        opacity="0.4"
        vector-effect="non-scaling-stroke"
      >
        <path d="M255 150 C 430 40, 700 30, 880 165 S 990 480, 700 580" />
        <rect x="404" y="52" width="24" height="32" />
        <rect x="700" y="80" width="24" height="32" />
        <rect x="905" y="330" width="24" height="32" />
        <rect x="742" y="548" width="24" height="32" />
      </g>
      <g class="hero-scene__seal" vector-effect="non-scaling-stroke">
        <rect x="556" y="38" width="30" height="40" fill="none" stroke-width="1.25" />
        <circle cx="571" cy="58" r="34" fill="none" stroke-width="1" opacity="0.45" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.hero-scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Matches HeroPattern's hole: nothing renders over the copy column. */
  mask-image: radial-gradient(
    ellipse 46% 62% at 26% 50%,
    transparent 0%,
    transparent 46%,
    rgba(0, 0, 0, 0.5) 74%,
    #000 100%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 46% 62% at 26% 50%,
    transparent 0%,
    transparent 46%,
    rgba(0, 0, 0, 0.5) 74%,
    #000 100%
  );
}

.hero-scene__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 900ms var(--ease-standard);
}

.hero-scene__canvas.is-active {
  opacity: 1;
}

.hero-scene__fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--graphite);
  transition: opacity var(--duration-slow) var(--ease-standard);
}

.hero-scene__seal {
  stroke: var(--seal);
}

.hero-scene__fallback.is-replaced {
  opacity: 0;
}

/*
 * Below the desktop breakpoint the copy is full width and the panel sits under
 * it: there is no open ground left for a trail to occupy, and every version of
 * this that tried ran sheets straight through the headline. The phone hero is
 * copy on clean paper — HeroPattern's grid carries the texture on its own.
 *
 * `display: none` is doing real work here, not just hiding pixels. A canvas
 * with no box never intersects, and `useThreeScene` waits on that intersection
 * before importing `three` — so on a phone this scene costs no chunk, no GL
 * context and no RAF loop (NFR2). ServiceScene further down the page may still
 * pull `three` on its own; this only stops the hero contributing to it.
 */
@media (max-width: 999px) {
  .hero-scene {
    display: none;
  }
}
</style>
