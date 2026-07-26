import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * useThreeScene — the single, safe home for every Three.js lifecycle on the site.
 *
 * Design constraints (this project deliberately trades some of the PRD's JS
 * budget for the 3D look — "look first, lazy-load 3D"):
 * - **Client-only + lazy.** `three` is dynamically imported in `onMounted`, so
 *   it never touches SSR and lands in its own code-split chunk fetched after
 *   first paint. Static routes keep their small budget; the 3D chunk is extra.
 * - **Reduced motion is honoured absolutely.** Under `prefers-reduced-motion`
 *   the scene never initialises; the caller's static fallback stays on screen.
 * - **Cheap when unseen.** The RAF loop pauses when the canvas scrolls offscreen
 *   (IntersectionObserver) and when the tab is hidden (visibilitychange).
 * - **DPR capped** at 2 so retina phones do not render 3–4× the pixels.
 * - **Everything is disposed** on unmount: geometries, materials, the renderer,
 *   the RAF, and all observers. No leaked GL contexts across route changes.
 *
 * The builder receives the `three` module plus a ready scene/camera/renderer and
 * returns a controller with `update(elapsed, dt)` and `dispose()`.
 */

export type ThreeModule = typeof import('three')

export interface SceneContext {
  THREE: ThreeModule
  scene: import('three').Scene
  camera: import('three').PerspectiveCamera
  renderer: import('three').WebGLRenderer
  canvas: HTMLCanvasElement
  width: number
  height: number
}

export interface SceneController {
  /** Called each frame. `elapsed` and `dt` are in seconds. */
  update?: (elapsed: number, dt: number) => void
  /** Called on resize with the new CSS pixel size. */
  resize?: (width: number, height: number) => void
  /** Release every GPU resource this scene allocated. */
  dispose: () => void
}

export type SceneBuilder = (ctx: SceneContext) => SceneController

export interface UseThreeSceneOptions {
  /** Vertical field of view in degrees. */
  fov?: number
  /** Camera z distance. */
  cameraZ?: number
  /** Clear-alpha; keep 0 so the paper/ink background shows through. */
  alpha?: boolean
}

export function useThreeScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  build: SceneBuilder,
  options: UseThreeSceneOptions = {},
) {
  /** True once the scene is live — the caller fades its fallback out on this. */
  const active = ref(false)

  let renderer: import('three').WebGLRenderer | null = null
  let controller: SceneController | null = null
  let raf = 0
  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let running = false
  let visible = true
  let onScreen = true
  let last = 0
  let start = 0
  let disposed = false

  function prefersReducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }

  function loop(now: number) {
    if (!running || !renderer || !controller) return
    const elapsed = (now - start) / 1000
    const dt = Math.min((now - last) / 1000, 0.05) // clamp long frames (tab wake)
    last = now
    controller.update?.(elapsed, dt)
    raf = requestAnimationFrame(loop)
  }

  function play() {
    if (running || !renderer || onScreen === false || !visible) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }

  function pause() {
    running = false
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function updateVisibility() {
    if (onScreen && visible) play()
    else pause()
  }

  function onDocVisibility() {
    visible = document.visibilityState === 'visible'
    updateVisibility()
  }

  onMounted(async () => {
    const canvas = canvasRef.value
    if (!canvas || prefersReducedMotion()) return

    let THREE: ThreeModule
    try {
      THREE = await import('three')
    } catch {
      return // fallback stays; nothing else to clean up
    }
    if (disposed || !canvasRef.value) return

    const parent = canvas.parentElement ?? canvas
    const width = parent.clientWidth || 1
    const height = parent.clientHeight || 1

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: options.alpha ?? true,
        powerPreference: 'high-performance',
      })
    } catch {
      renderer = null
      return // no WebGL — keep the static fallback
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(options.fov ?? 45, width / height, 0.1, 100)
    camera.position.z = options.cameraZ ?? 6

    controller = build({ THREE, scene, camera, renderer, canvas, width, height })

    start = performance.now()
    active.value = true

    // Resize with the parent element.
    resizeObserver = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect
      if (!box || !renderer) return
      const w = Math.max(1, box.width)
      const h = Math.max(1, box.height)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      controller?.resize?.(w, h)
    })
    resizeObserver.observe(parent)

    // Pause when scrolled offscreen.
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true
        updateVisibility()
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(canvas)

    document.addEventListener('visibilitychange', onDocVisibility)
    play()
  })

  onBeforeUnmount(() => {
    disposed = true
    pause()
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', onDocVisibility)
    }
    controller?.dispose()
    controller = null
    renderer?.dispose()
    renderer = null
  })

  return { active }
}
