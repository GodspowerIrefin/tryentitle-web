import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { initMotion, refreshMotion } from './lib/motion'

// Design tokens first, then base styles that consume them, then the motion layer
// last — it composes on top of both and must be able to override neither.
import './styles/tokens.css'
import './styles/globals.css'
import './styles/motion.css'

// Self-hosted fonts (PRD NFR7). Fontsource ships woff2 + `font-display: swap`
// with no external requests at runtime. Latin subsets only.
//
// Newsreader is the one face across the whole site — display, body, and labels —
// matching the premium design file. `opsz.css` carries the weight (200–800) AND
// optical-size axes, so large headlines get the display cut automatically.
import '@fontsource-variable/newsreader/opsz.css'

/**
 * ViteSSG statically generates every route at build time and hydrates on the
 * client. It sets up `@unhead/vue` automatically, so `useHead()` works in both
 * SSR and browser. Head/SEO tags are declared per page via lib/metadata.
 */
export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  },
  ({ router }) => {
    if (!import.meta.env.SSR) {
      // Move keyboard focus to the main landmark on route change so keyboard and
      // screen-reader users are not stranded at the top of a new document.
      //
      // Skipped on the FIRST navigation (initial page load): the browser should
      // start focus at the top of the document so the very first Tab reaches the
      // skip link. Stealing focus into <main> on load would bypass it.
      let isInitialNavigation = true
      router.afterEach(() => {
        if (isInitialNavigation) {
          isInitialNavigation = false
          // Start the motion layer against the server-rendered markup that is
          // already on screen. Deferred a frame so it measures settled layout.
          //
          // Everything inside no-ops under `prefers-reduced-motion` and every
          // piece is additive: if any of it throws, the page is still a fully
          // working document.
          requestAnimationFrame(initMotion)
          return
        }
        requestAnimationFrame(() => {
          const main = document.getElementById('main')
          main?.focus()

          /*
           * Route entrance: displace the landmark, then release it on the next
           * frame so it settles back. Two frames are required — setting and
           * clearing the class in the same frame is coalesced into no change at
           * all, and the transition never runs.
           *
           * Reduced motion is handled in motion.css (the offset resolves to 0),
           * so there is no branch here.
           */
          main?.classList.add('route-entering')
          requestAnimationFrame(() => main?.classList.remove('route-entering'))

          // New route, new markup: re-scan reveal, effect, and hover targets.
          refreshMotion()
        })
      })
    }
  },
)
