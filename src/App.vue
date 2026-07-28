<script setup lang="ts">
/**
 * App shell — the chrome present on every page (PRD §11.2 root layout):
 * skip link, sticky header, the routed <main> landmark, and the footer.
 *
 * `<main id="main" tabindex="-1">` is the skip-link target and the element that
 * receives focus on route change (wired in main.ts) so keyboard and
 * screen-reader users land in the new page's content, not back at the top.
 */
import { RouterView } from 'vue-router'
import SkipToContent from '@/components/layout/SkipToContent'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
</script>

<template>
  <SkipToContent />
  <SiteHeader />
  <main id="main" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter />
</template>

<style scoped>
main:focus {
  outline: none;
}
</style>
