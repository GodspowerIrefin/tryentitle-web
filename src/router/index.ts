import type { RouteRecordRaw } from 'vue-router'

/**
 * Route table — mirrors the information architecture in PRD §6.
 *
 * vite-ssg consumes this array and statically renders each path. Dynamic
 * segments (services/industries/blog detail pages) are expanded to concrete
 * paths by the `includedRoutes` hook in main.ts, sourced from the content layer.
 *
 * Routes are added here as their page components land, so `npm run build`
 * never references a file that does not yet exist.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/pages/ServicesOverviewPage.vue'),
  },
  {
    path: '/services/:slug',
    name: 'service-detail',
    component: () => import('@/pages/ServiceDetailPage.vue'),
  },
  {
    path: '/industries',
    name: 'industries',
    component: () => import('@/pages/IndustriesOverviewPage.vue'),
  },
  {
    path: '/industries/:slug',
    name: 'industry-detail',
    component: () => import('@/pages/IndustryDetailPage.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/pages/BlogIndexPage.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('@/pages/BlogPostPage.vue'),
  },

  // The four legal documents share one long-form template (PRD §11.2 route
  // group equivalent); the slug selects the document from the content layer.
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/pages/LegalPage.vue'),
    props: { slug: 'privacy' },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/pages/LegalPage.vue'),
    props: { slug: 'terms' },
  },
  {
    path: '/security',
    name: 'security',
    component: () => import('@/pages/LegalPage.vue'),
    props: { slug: 'security' },
  },
  {
    path: '/dpa',
    name: 'dpa',
    component: () => import('@/pages/LegalPage.vue'),
    props: { slug: 'dpa' },
  },

  {
    // Custom 404 (PRD FR4). vite-ssg renders this to /404.html.
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]
