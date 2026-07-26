<script setup lang="ts">
/**
 * WorkflowScene — the hero's signature 3D visual (this project's "3D everywhere"
 * direction). Document tokens travel a pipeline of five nodes; at the exception
 * they detour down to a brass human-review node and rejoin the flow. It states
 * the positioning the same way the flat rail does, in motion.
 *
 * Client-only and lazy via useThreeScene: the `three` chunk loads after first
 * paint. Until then — and under prefers-reduced-motion or without WebGL — the
 * default slot (the ExceptionRail SVG) is what shows. The canvas is decorative
 * (`aria-hidden`); the SVG keeps the accessible description even while the 3D is
 * visible, so assistive tech is never left without the meaning.
 */
import { ref } from 'vue'
import { useThreeScene, type SceneController, type SceneContext } from '@/lib/three/useThreeScene'
import { tokenColor } from '@/lib/three/palette'

/** `cover` = full-bleed hero backdrop (weights the pipeline to the right so the
 *  overlaid copy sits on clean darkness). Default is the standalone framing. */
const props = withDefaults(defineProps<{ cover?: boolean }>(), { cover: false })

const canvas = ref<HTMLCanvasElement | null>(null)

function build({ THREE, scene, camera, renderer, width, height }: SceneContext): SceneController {
  // Frame the whole pipeline for the current aspect: pull the camera back far
  // enough that the outer stages (and their labels) never clip on narrow panels,
  // while staying close on wide ones. In cover mode, offset the view so the
  // pipeline weights to the right, clear of the left-hand copy.
  function fitCamera(aspect: number) {
    const halfTan = Math.tan(((camera.fov || 45) * Math.PI) / 180 / 2)
    const shift = props.cover && aspect > 1.3 ? -1.7 : 0
    const need = 3.5 + Math.abs(shift)
    const zWidth = need / (halfTan * Math.max(aspect, 0.4))
    const zHeight = 2.7 / halfTan
    const z = Math.max(zWidth, zHeight, 5)
    camera.position.set(shift, -0.6, z)
    camera.lookAt(shift, -0.6, 0)
  }
  fitCamera(width / height)

  const group = new THREE.Group()
  scene.add(group)

  // Tuned for the dark stage: light nodes, signal-green lines, brass exception.
  const nodeColor = tokenColor(THREE, 'color-paper')
  const signal = tokenColor(THREE, 'color-signal-500')
  const graphite = tokenColor(THREE, 'color-graphite-300')
  const brass = tokenColor(THREE, 'color-brass-500')

  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(o: T): T => (disposables.push(o), o)

  // Five pipeline nodes along x, plus the human-review node offset below.
  const NODES = [-3.2, -1.6, 0, 1.6, 3.2].map((x) => new THREE.Vector3(x, 0, 0))
  const HR = new THREE.Vector3(0.8, -1.9, 0.3)

  // A soft additive halo sprite reused for every glowing element.
  function haloTexture(): import('three').Texture {
    const size = 64
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.4, 'rgba(255,255,255,0.35)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    return tex
  }
  const halo = track(haloTexture())
  function glow(color: import('three').Color, scale: number): import('three').Sprite {
    const mat = track(
      new THREE.SpriteMaterial({ map: halo, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    )
    const s = new THREE.Sprite(mat)
    s.scale.setScalar(scale)
    return s
  }

  // Text label as a billboarded sprite drawn from a canvas, so the scene names
  // its own stages (INTAKE … FILED, HUMAN REVIEW) the way the SVG diagram does —
  // without labels the flow is just abstract dots. Rendered on top (depthTest
  // off) so particles never occlude the text.
  const labelColor = tokenColor(THREE, 'color-rule')
  function makeLabel(text: string, color: import('three').Color, worldH = 0.24): import('three').Sprite {
    const ss = 3 // supersample for crisp text
    const fontPx = 26 * ss
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')!
    const font = `500 ${fontPx}px "IBM Plex Mono", ui-monospace, monospace`
    ctx.font = font
    try {
      ctx.letterSpacing = `${2 * ss}px`
    } catch {
      /* letterSpacing unsupported — acceptable */
    }
    const w = Math.ceil(ctx.measureText(text).width) + 10 * ss
    const h = Math.ceil(fontPx * 1.5)
    c.width = w
    c.height = h
    ctx.font = font // context state resets when the canvas is resized
    try {
      ctx.letterSpacing = `${2 * ss}px`
    } catch {
      /* noop */
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = `#${color.getHexString()}`
    ctx.fillText(text, w / 2, h / 2)

    const tex = track(new THREE.CanvasTexture(c))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    const mat = track(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }),
    )
    const sprite = new THREE.Sprite(mat)
    sprite.scale.set(worldH * (w / h), worldH, 1)
    return sprite
  }

  const STAGE_NAMES = ['INTAKE', 'EXTRACT', 'VALIDATE', 'SYNC', 'FILED']

  const nodeGeo = track(new THREE.SphereGeometry(0.11, 20, 20))
  const nodeMat = track(new THREE.MeshBasicMaterial({ color: nodeColor }))
  const nodeMeshes: import('three').Mesh[] = []
  NODES.forEach((p, i) => {
    const m = new THREE.Mesh(nodeGeo, nodeMat)
    m.position.copy(p)
    group.add(m)
    nodeMeshes.push(m)
    const h = glow(signal, 0.9)
    h.position.copy(p)
    group.add(h)
    // Stage name below each node.
    const label = makeLabel(STAGE_NAMES[i]!, labelColor)
    label.position.set(p.x, p.y - 0.5, p.z)
    group.add(label)
  })

  // Human-review node — brass, with a stronger glow (the one point that matters).
  const hrNode = new THREE.Mesh(track(new THREE.SphereGeometry(0.16, 20, 20)), track(new THREE.MeshBasicMaterial({ color: brass })))
  hrNode.position.copy(HR)
  group.add(hrNode)
  const hrGlow = glow(brass, 1.5)
  hrGlow.position.copy(HR)
  group.add(hrGlow)

  // Human-review label — brass, the one accent that carries the positioning.
  const hrLabel = makeLabel('HUMAN REVIEW', brass, 0.26)
  hrLabel.position.set(HR.x, HR.y - 0.52, HR.z)
  group.add(hrLabel)

  // Connector lines: the baseline flow + the brass exception branch.
  const flowMat = track(new THREE.LineBasicMaterial({ color: signal, transparent: true, opacity: 0.8 }))
  const flowPts: number[] = []
  for (let i = 0; i < NODES.length - 1; i++) {
    flowPts.push(NODES[i]!.x, 0, 0, NODES[i + 1]!.x, 0, 0)
  }
  const flowGeo = track(new THREE.BufferGeometry())
  flowGeo.setAttribute('position', new THREE.Float32BufferAttribute(flowPts, 3))
  group.add(new THREE.LineSegments(flowGeo, flowMat))

  const branchMat = track(new THREE.LineBasicMaterial({ color: brass, transparent: true, opacity: 0.9 }))
  const branchGeo = track(new THREE.BufferGeometry())
  branchGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [NODES[2]!.x, 0, 0, HR.x, HR.y, HR.z, HR.x, HR.y, HR.z, NODES[3]!.x, 0, 0],
      3,
    ),
  )
  group.add(new THREE.LineSegments(branchGeo, branchMat))

  // Document tokens travelling the pipeline, detouring through human review.
  // The path is sampled ONCE into a flat array at build time; the update loop
  // then indexes that array. This avoids calling curve.getPoint() per frame
  // (which throws if ever handed a non-finite t) and is cheaper besides.
  const curve = new THREE.CatmullRomCurve3(
    [NODES[0]!, NODES[1]!, NODES[2]!, HR, NODES[3]!, NODES[4]!],
    false,
    'catmullrom',
    0.3,
  )
  const SAMPLES = 300
  const PATH: import('three').Vector3[] = []
  for (let i = 0; i < SAMPLES; i++) PATH.push(curve.getPoint(i / SAMPLES))

  const tokenGeo = track(new THREE.OctahedronGeometry(0.12, 0))
  const TOKENS = [0, 0.33, 0.66].map((phase) => {
    const mat = track(new THREE.MeshBasicMaterial({ color: brass, transparent: true }))
    const mesh = new THREE.Mesh(tokenGeo, mat)
    const g = glow(brass, 0.7)
    mesh.add(g)
    group.add(mesh)
    return { mesh, mat, phase }
  })

  // Ambient particle field for depth.
  const COUNT = 110
  const pPos = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 12
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 6
    pPos[i * 3 + 2] = -1.5 - Math.random() * 4
  }
  const pGeo = track(new THREE.BufferGeometry())
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3))
  const pMat = track(
    new THREE.PointsMaterial({ color: graphite, size: 0.045, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  const points = new THREE.Points(pGeo, pMat)
  scene.add(points)

  // Pointer parallax.
  const target = { x: 0, y: 0 }
  function onPointer(e: PointerEvent) {
    const r = renderer.domElement.getBoundingClientRect()
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  return {
    update(elapsed) {
      if (!Number.isFinite(elapsed)) return
      // Gentle parallax only — keep the pipeline reading clearly left-to-right
      // so the labelled stages stay legible.
      group.rotation.y += (target.x * 0.1 - group.rotation.y) * 0.04
      group.rotation.x += (-target.y * 0.06 - group.rotation.x) * 0.04

      for (const m of nodeMeshes) {
        const s = 1 + Math.sin(elapsed * 2 + m.position.x) * 0.12
        m.scale.setScalar(s)
      }
      hrNode.scale.setScalar(1 + Math.sin(elapsed * 2.6) * 0.14)

      for (const t of TOKENS) {
        const u = ((((elapsed * 0.12 + t.phase) % 1) + 1) % 1)
        const idx = Math.min(SAMPLES - 1, Math.max(0, Math.floor(u * SAMPLES)))
        t.mesh.position.copy(PATH[idx]!)
        t.mesh.rotation.x = elapsed * 1.4
        t.mesh.rotation.y = elapsed * 1.1
        // Fade in at the start of the run and out at the end.
        t.mat.opacity = Math.min(1, u / 0.1, (1 - u) / 0.1)
      }

      points.rotation.y = elapsed * 0.02
      renderer.render(scene, camera)
    },
    resize(w, h) {
      fitCamera(w / h)
    },
    dispose() {
      window.removeEventListener('pointermove', onPointer)
      for (const d of disposables) d.dispose()
    },
  }
}

const { active } = useThreeScene(canvas, build, { fov: 45, cameraZ: 6.6 })
</script>

<template>
  <div class="scene" :class="{ 'scene--cover': cover }">
    <canvas ref="canvas" class="scene__canvas" :class="{ 'is-active': active }" aria-hidden="true" />
    <div class="scene__fallback" :class="{ 'is-replaced': active }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  min-height: 260px;
}

/* Full-bleed backdrop: fill the positioned parent; centre the SVG fallback in
   the frame instead of letting it sit at its natural top-left size. */
.scene--cover {
  position: absolute;
  inset: 0;
  min-height: 0;
}

.scene--cover .scene__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 5vw, 3rem);
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
  position: relative;
  z-index: 1;
  transition: opacity 400ms var(--ease-standard);
}

/* When the 3D is live the SVG stays in the a11y tree (opacity, not display) but
   yields the visual to the canvas. */
.scene__fallback.is-replaced {
  opacity: 0;
  pointer-events: none;
}

@media (min-width: 720px) {
  .scene {
    min-height: 320px;
  }
}
</style>
