import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'

// Design tokens first, then base styles that consume them.
import './styles/tokens.css'
import './styles/globals.css'

// Self-hosted fonts (PRD NFR7). Fontsource ships woff2 + `font-display: swap`
// with no external requests at runtime. Only the weights in PRD §10.4 are loaded.
import '@fontsource-variable/archivo'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
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
          return
        }
        requestAnimationFrame(() => {
          document.getElementById('main')?.focus()
        })
      })
    }
  },
)
