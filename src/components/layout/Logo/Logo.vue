<script setup lang="ts">
/**
 * Logo — the TryEntitle mark plus wordmark.
 *
 * The mark is the official brand artwork, supplied as a JPEG on a black field
 * and converted here to a transparent PNG. The conversion is alpha-from-
 * luminance with un-premultiply, not a colour key: the artwork is additive light
 * on black and its darkest region (#162127) sits barely above the field, so a
 * key would have eaten the dark teal bar. Deriving alpha from brightness keeps
 * every translucent overlap intact.
 *
 * ⚠ INTERIM ASSET — PRD D3 is still open.
 * D3 calls for an SVG wordmark with a monochrome variant. This is a raster
 * upscaled from a 256×320 source, so it cannot be recoloured for a light ground
 * and will not stay crisp past ~45px. Replace `public/brand/logo-mark.*` with the
 * vector original when it exists; nothing outside this component needs to change.
 *
 * WHERE IT WORKS. The artwork's translucency assumes a black backing, so it
 * reads correctly on ink and washes out on bond. Both the header and the footer
 * are ink bands, which is why the mark is unqualified there. On a light surface
 * it needs a dark plate — `tone="plated"` provides one.
 */
withDefaults(defineProps<{ tone?: 'default' | 'inverse' | 'plated'; markOnly?: boolean }>(), {
  tone: 'default',
  markOnly: false,
})
</script>

<template>
  <span class="logo" :class="[`logo--${tone}`, { 'logo--mark-only': markOnly }]" aria-label="TryEntitle">
    <img
      class="logo__mark"
      src="/brand/logo-mark.png"
      srcset="/brand/logo-mark.png 1x, /brand/logo-mark@2x.png 2x"
      alt=""
      width="144"
      height="180"
      decoding="async"
    />
    <span v-if="!markOnly" class="logo__word" aria-hidden="true">TryEntitle</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.3125rem;
  letter-spacing: -0.02em;
  line-height: 1;
  font-variation-settings: 'wdth' 95;
  color: inherit;
}

/* Site name always carries the orange brand — independent of band inheritance. */
.logo__word {
  color: var(--seal);
}

/*
 * Height-led: the mark is portrait (0.8:1), so width follows.
 *
 * 42px is close to the floor for this artwork. It is a detailed isometric
 * composition whose hairline traces stop resolving below roughly 40px, so it is
 * sized as large as the 64px compact header allows rather than to match the
 * wordmark's cap height. A simplified small-size variant of the mark is the real
 * fix — see the D3 note above.
 */
.logo__mark {
  height: 42px;
  width: auto;
  flex: none;
}

/* Dark plate for light surfaces, matching the ink icon tiles used elsewhere. */
.logo--plated .logo__mark {
  background-color: var(--ink);
  border-radius: var(--radius-chip);
  padding: var(--space-1);
  box-sizing: content-box;
}

.logo--inverse {
  color: var(--text-on-ink);
}

.logo--inverse .logo__word {
  color: var(--seal);
}

.logo--mark-only {
  gap: 0;
}

@media (max-width: 560px) {
  .logo__mark {
    height: 28px;
  }

  .logo {
    font-size: 1.1875rem;
  }
}
</style>
