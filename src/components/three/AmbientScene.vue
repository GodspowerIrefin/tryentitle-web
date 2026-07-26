<script setup lang="ts">
/**
 * AmbientScene — a subtle drifting node/link constellation used as a backdrop
 * for detail-page headers and the closing CTA, so the "tech" language carries
 * across the whole site (this project's "3D everywhere" direction) without a
 * heavy interactive scene on every route.
 *
 * Deliberately cheap: ~46 nodes, fixed edges built once, slow rotation. Lazy and
 * client-only via useThreeScene; under prefers-reduced-motion or without WebGL
 * nothing renders and the (transparent) backdrop simply stays empty — the page
 * behind it is fully legible on its own. The canvas is decorative (aria-hidden).
 */
import { ref } from 'vue'
import { useThreeScene, type SceneContext, type SceneController } from '@/lib/three/useThreeScene'
import { tokenColor } from '@/lib/three/palette'

const props = withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })

const canvas = ref<HTMLCanvasElement | null>(null)

function build({ THREE, scene, camera, renderer }: SceneContext): SceneController {
  camera.position.set(0, 0, 7)

  const group = new THREE.Group()
  scene.add(group)

  const dark = props.tone === 'dark'
  const nodeCol = tokenColor(THREE, dark ? 'color-signal-500' : 'color-graphite-500')
  const lineCol = tokenColor(THREE, dark ? 'color-signal-600' : 'color-rule')
  const brass = tokenColor(THREE, 'color-brass-500')

  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(o: T): T => (disposables.push(o), o)

  // Scatter nodes through a wide, shallow slab.
  const N = 46
  const pts: import('three').Vector3[] = []
  for (let i = 0; i < N; i++) {
    pts.push(new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3))
  }

  // Node points; a couple are brass accents (the exception motif).
  const nodePos = new Float32Array(N * 3)
  const nodeColors = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    nodePos[i * 3] = pts[i]!.x
    nodePos[i * 3 + 1] = pts[i]!.y
    nodePos[i * 3 + 2] = pts[i]!.z
    const c = i % 17 === 0 ? brass : nodeCol
    nodeColors[i * 3] = c.r
    nodeColors[i * 3 + 1] = c.g
    nodeColors[i * 3 + 2] = c.b
  }
  const nodeGeo = track(new THREE.BufferGeometry())
  nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePos, 3))
  nodeGeo.setAttribute('color', new THREE.Float32BufferAttribute(nodeColors, 3))
  const nodeMat = track(
    new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: dark ? 0.95 : 0.8,
      blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    }),
  )
  group.add(new THREE.Points(nodeGeo, nodeMat))

  // Fixed edges: connect each node to its two nearest neighbours (deduped).
  const edges = new Set<string>()
  const linePos: number[] = []
  for (let i = 0; i < N; i++) {
    const d = pts
      .map((p, j) => ({ j, dist: p.distanceToSquared(pts[i]!) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2)
    for (const { j } of d) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (edges.has(key)) continue
      edges.add(key)
      linePos.push(pts[i]!.x, pts[i]!.y, pts[i]!.z, pts[j]!.x, pts[j]!.y, pts[j]!.z)
    }
  }
  const lineGeo = track(new THREE.BufferGeometry())
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
  const lineMat = track(
    new THREE.LineBasicMaterial({ color: lineCol, transparent: true, opacity: dark ? 0.35 : 0.55 }),
  )
  group.add(new THREE.LineSegments(lineGeo, lineMat))

  const target = { x: 0, y: 0 }
  function onPointer(e: PointerEvent) {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.y = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  return {
    update(elapsed) {
      if (!Number.isFinite(elapsed)) return
      group.rotation.y = elapsed * 0.03 + target.x * 0.15
      group.rotation.x += (target.y * 0.08 - group.rotation.x) * 0.04
      renderer.render(scene, camera)
    },
    dispose() {
      window.removeEventListener('pointermove', onPointer)
      for (const d of disposables) d.dispose()
    },
  }
}

const { active } = useThreeScene(canvas, build, { fov: 55, cameraZ: 7 })
</script>

<template>
  <canvas ref="canvas" class="ambient" :class="{ 'is-active': active }" aria-hidden="true" />
</template>

<style scoped>
.ambient {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 800ms var(--ease-standard);
  pointer-events: none;
}

.ambient.is-active {
  opacity: 1;
}
</style>
