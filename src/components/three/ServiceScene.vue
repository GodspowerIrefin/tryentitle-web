<script setup lang="ts">
/**
 * ServiceScene — the 3D visual for the pinned services band.
 *
 * A population of document planes that RE-FORMS as the active service changes.
 * Each service owns a formation, and the planes lerp between formations rather
 * than cutting, so the transition reads as the same work being rearranged — which
 * is what TryEntitle actually sells — instead of six unrelated animations:
 *
 *   0 Assessment    a flat survey grid — everything laid out to be measured
 *   1 Agents        a single moving chain — work carried between systems
 *   2 Documents     a sorted column — intake resolving into one filed stack
 *   3 Customer      an orbit around one point — the work circling a customer
 *   4 Internal      two facing columns — handoffs between your own teams
 *   5 Integrations  a connected ring — the systems you already pay for
 *
 * One plane is always seal-coloured and sits slightly out of formation: the
 * human on the exception. It is the same argument as the hero's gold node and the
 * oversight bar's gold segment, made a third time.
 *
 * Cost containment is entirely in `useThreeScene`: the `three` chunk is not even
 * requested until this canvas nears the viewport, the loop pauses offscreen, and
 * under `prefers-reduced-motion` the scene never initialises and the default slot
 * (a static fallback) stays on screen.
 */
import { ref, watch } from 'vue'
import { useThreeScene, type SceneContext, type SceneController } from '@/lib/three/useThreeScene'
import { tokenColor } from '@/lib/three/palette'

const props = withDefaults(
  defineProps<{
    /** Which service formation to hold. */
    activeIndex: number
    /** How many services there are, so formations can scale to the set. */
    count?: number
  }>(),
  { count: 6 },
)

const canvas = ref<HTMLCanvasElement | null>(null)

/** Written by the builder so the watcher below can push index changes in. */
let setFormation: ((index: number) => void) | null = null

const PLANES = 15
/** The plane that carries the seal accent — the human on the exception. */
const HUMAN_PLANE = 7

function build({ THREE, scene, camera, renderer, width, height }: SceneContext): SceneController {
  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(o: T): T => (disposables.push(o), o)

  function fitCamera(aspect: number) {
    const halfTan = Math.tan(((camera.fov || 45) * Math.PI) / 180 / 2)
    const need = 3.1
    const z = Math.max(need / (halfTan * Math.max(aspect, 0.5)), 2.6 / halfTan, 5)
    /*
     * Offset the view rightward on wide screens, which pushes the formation left
     * on screen — into the open area beside the tab rail. Centred, half of every
     * formation sat behind the opaque panel. Narrow panels keep it centred, where
     * there is no panel beside it to avoid.
     */
    const shift = aspect > 1.5 ? 0.5 : 0
    camera.position.set(shift, 0, z)
    camera.lookAt(shift, 0, 0)
  }
  fitCamera(width / height)

  const group = new THREE.Group()
  scene.add(group)

  /*
   * Colours for a LIGHT ground. The services band is bond, so the sheets are drawn
   * as dark ink outlines with a faint ink wash — the inverse of what a dark band
   * would need. An earlier version used near-white planes at low opacity, correct
   * for ink and completely invisible here.
   */
  const sheetFill = tokenColor(THREE, 'ink')
  const seal = tokenColor(THREE, 'seal')
  const verify = tokenColor(THREE, 'verify')
  const rule = tokenColor(THREE, 'graphite')

  // ─── Document planes ──────────────────────────────────────────────────
  // A plane, not a box: these are sheets of paper. Thin enough that the edge-on
  // view reads as a document rather than a slab.
  const sheetGeo = track(new THREE.PlaneGeometry(0.62, 0.82))
  const edgeGeo = track(new THREE.EdgesGeometry(sheetGeo))

  interface Sheet {
    mesh: import('three').Mesh
    edges: import('three').LineSegments
    target: import('three').Vector3
    targetRot: import('three').Euler
    spin: number
  }

  const sheets: Sheet[] = []
  for (let i = 0; i < PLANES; i++) {
    const isHuman = i === HUMAN_PLANE
    const mat = track(
      new THREE.MeshBasicMaterial({
        color: isHuman ? seal : sheetFill,
        transparent: true,
        opacity: isHuman ? 0.22 : 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    const lineMat = track(
      new THREE.LineBasicMaterial({
        color: isHuman ? seal : rule,
        transparent: true,
        opacity: isHuman ? 1 : 0.5,
      }),
    )
    const mesh = new THREE.Mesh(sheetGeo, mat)
    const edges = new THREE.LineSegments(edgeGeo, lineMat)
    mesh.add(edges)
    group.add(mesh)
    sheets.push({
      mesh,
      edges,
      target: new THREE.Vector3(),
      targetRot: new THREE.Euler(),
      spin: (Math.random() - 0.5) * 0.4,
    })
  }

  // ─── Connector lines ──────────────────────────────────────────────────
  // Redrawn every frame between consecutive sheets. Only shown in the formations
  // where a connection means something (chain, ring, handoff).
  const linkPositions = new Float32Array(PLANES * 6)
  const linkGeo = track(new THREE.BufferGeometry())
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3))
  const linkMat = track(
    new THREE.LineBasicMaterial({ color: verify, transparent: true, opacity: 0 }),
  )
  const links = new THREE.LineSegments(linkGeo, linkMat)
  group.add(links)

  /** How strongly the current formation wants connector lines drawn. */
  let linkTarget = 0

  // ─── Formations ───────────────────────────────────────────────────────
  const TAU = Math.PI * 2

  function formation(index: number) {
    const n = PLANES
    linkTarget = 0

    for (let i = 0; i < n; i++) {
      const s = sheets[i]!
      const t = i / (n - 1) // 0..1 along the population
      const p = s.target
      const r = s.targetRot

      switch (index) {
        // 0 — Assessment: a flat survey grid, everything laid out to be measured.
        case 0: {
          const cols = 5
          const col = i % cols
          const row = Math.floor(i / cols)
          p.set((col - (cols - 1) / 2) * 0.78, (1 - row) * 0.95, 0)
          r.set(-0.42, 0, 0)
          break
        }
        // 1 — Agents: one chain carrying work left to right.
        case 1: {
          p.set((t - 0.5) * 5.2, Math.sin(t * TAU) * 0.34, Math.cos(t * TAU) * 0.34)
          r.set(0, t * 1.6, 0)
          linkTarget = 0.5
          break
        }
        // 2 — Documents: a sorted column resolving into one filed stack.
        case 2: {
          p.set(Math.sin(i * 1.9) * 0.1, (t - 0.5) * 3.1, Math.cos(i * 1.9) * 0.1)
          r.set(-0.1, i * 0.09, 0)
          break
        }
        // 3 — Customer: the work circling one point.
        case 3: {
          const a = t * TAU
          p.set(Math.cos(a) * 1.85, Math.sin(a) * 0.55, Math.sin(a) * 1.85)
          r.set(0, -a, 0)
          break
        }
        // 4 — Internal: two facing columns, handoffs between them.
        case 4: {
          const side = i % 2 === 0 ? -1 : 1
          const rank = Math.floor(i / 2)
          p.set(side * 1.5, (rank - (n / 2 - 1) / 2) * 0.62, 0)
          r.set(0, side * 0.55, 0)
          linkTarget = 0.34
          break
        }
        // 5 — Integrations: a connected ring of systems.
        default: {
          const a = t * TAU
          p.set(Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0)
          r.set(0, 0, a)
          linkTarget = 0.6
          break
        }
      }
    }
  }

  formation(props.activeIndex)
  // Start the sheets AT their first formation so the band does not open mid-morph.
  for (const s of sheets) {
    s.mesh.position.copy(s.target)
    s.mesh.rotation.copy(s.targetRot)
  }
  setFormation = formation

  // ─── Pointer parallax ─────────────────────────────────────────────────
  // Normalised against the viewport, not the canvas rect: this fires on every
  // pointer move and `getBoundingClientRect()` would force a layout each time.
  const aim = { x: 0, y: 0 }
  function onPointer(e: PointerEvent) {
    aim.x = (e.clientX / window.innerWidth - 0.5) * 2
    aim.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let linkOpacity = 0

  return {
    update(elapsed, dt) {
      if (!Number.isFinite(dt)) return
      // Frame-rate-independent easing: the same visual speed at 60 and 144Hz.
      const ease = 1 - Math.pow(0.0016, dt)

      for (const s of sheets) {
        s.mesh.position.lerp(s.target, ease)
        s.mesh.rotation.x += (s.targetRot.x - s.mesh.rotation.x) * ease
        s.mesh.rotation.y += (s.targetRot.y - s.mesh.rotation.y) * ease
        s.mesh.rotation.z += (s.targetRot.z - s.mesh.rotation.z) * ease
        // A whisper of independent drift so a settled formation still breathes.
        s.mesh.position.y += Math.sin(elapsed * 0.6 + s.spin * 9) * 0.0008
      }

      // Connectors follow the sheets wherever they went.
      for (let i = 0; i < PLANES; i++) {
        const a = sheets[i]!.mesh.position
        const b = sheets[(i + 1) % PLANES]!.mesh.position
        const o = i * 6
        linkPositions[o] = a.x
        linkPositions[o + 1] = a.y
        linkPositions[o + 2] = a.z
        linkPositions[o + 3] = b.x
        linkPositions[o + 4] = b.y
        linkPositions[o + 5] = b.z
      }
      linkGeo.attributes.position!.needsUpdate = true
      linkOpacity += (linkTarget - linkOpacity) * ease
      linkMat.opacity = linkOpacity

      group.rotation.y += (aim.x * 0.22 - group.rotation.y) * 0.035
      group.rotation.x += (-aim.y * 0.12 - group.rotation.x) * 0.035

      renderer.render(scene, camera)
    },
    resize(w, h) {
      fitCamera(w / h)
    },
    dispose() {
      window.removeEventListener('pointermove', onPointer)
      setFormation = null
      for (const d of disposables) d.dispose()
    },
  }
}

const { active } = useThreeScene(canvas, build, { fov: 45, cameraZ: 6.4 })

// Push index changes into the scene. The scene may not exist yet (chunk still
// loading, reduced motion, no WebGL) — the guard is the contract, not a bug.
watch(
  () => props.activeIndex,
  (index) => setFormation?.(index),
)
</script>

<template>
  <div class="scene">
    <canvas ref="canvas" class="scene__canvas" :class="{ 'is-active': active }" aria-hidden="true" />
    <!-- Static fallback: what shows before the chunk lands, without WebGL, and
         under prefers-reduced-motion. Kept in the a11y tree either way. -->
    <div class="scene__fallback" :class="{ 'is-replaced': active }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.scene__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 600ms var(--ease-standard);
}

.scene__canvas.is-active {
  opacity: 1;
}

.scene__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transition: opacity var(--duration-slow) var(--ease-standard);
}

.scene__fallback.is-replaced {
  opacity: 0;
}
</style>
