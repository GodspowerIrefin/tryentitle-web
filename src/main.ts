import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { initReveals, refreshReveals } from './lib/reveal'
import { initSmoothScroll } from './lib/smooth-scroll'

// Design tokens first, then base styles that consume them.
import './styles/tokens.css'
import './styles/globals.css'

// Self-hosted fonts (PRD NFR7). Fontsource ships woff2 + `font-display: swap`
// with no external requests at runtime. Latin subsets only.
//
// Bricolage Grotesque carries H1–H2 only. `standard.css` includes both the
// weight and WIDTH axes — the width axis is what lets display type narrow at
// large sizes for the engineered feel the spec asks for (§1 Typography).
import '@fontsource-variable/bricolage-grotesque/standard.css'
// Instrument Sans covers all body copy, cards, and nav across 400–600.
import '@fontsource-variable/instrument-sans/standard.css'
// Plex Mono is the utility face: eyebrows, stage labels, stat figures, and the
// process rail. It is the personality carrier — every label reads as a record
// entry, which is what sells "auditable process" (§1).
import '@fontsource/ibm-plex-mono/500.css'

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
      // Eased wheel scrolling and scroll reveals. Both no-op under
      // `prefers-reduced-motion`, and both are additive: if either throws, the
      // page is still a fully working document.
      initSmoothScroll()

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
          // Arm reveals for the server-rendered markup that is already on screen.
          requestAnimationFrame(initReveals)
          return
        }
        requestAnimationFrame(() => {
          document.getElementById('main')?.focus()
          // New route, new markup: pick up its reveal targets.
          refreshReveals()
        })
      })
    }
  },
)
