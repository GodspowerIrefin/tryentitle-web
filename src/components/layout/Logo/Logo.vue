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
withDefaults(
  defineProps<{ tone?: 'default' | 'inverse' | 'plated' | 'light'; markOnly?: boolean }>(),
  {
    tone: 'default',
    markOnly: false,
  },
)
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
    <!-- One text node, deliberately unbroken: any whitespace or newline between
         the two spans renders as a space inside the wordmark. -->
    <span v-if="!markOnly" class="logo__word" aria-hidden="true"><span class="logo__word-try">Try</span>Entitle</span>
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

/*
 * The wordmark is two-tone: "Try" carries the brand orange, "Entitle" takes the
 * band's own text colour.
 *
 * "Entitle" inherits rather than naming a colour, which is what makes the one
 * component correct on both grounds — ink on the cream header and footer, and
 * near-white wherever the mark sits on an ink band. Naming `--ink` here would
 * paint it black-on-black the first time this lands on a dark surface.
 *
 * Contrast: raw `--seal` is only ~2.6:1 on paper, below what body text needs.
 * It is allowed here because WCAG 1.4.3 exempts brand logotypes, and this is the
 * mark itself — not a licence to use raw seal for the words around it.
 */
.logo__word {
  color: inherit;
}

.logo__word-try {
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

/*
 * Light ground, no plate.
 *
 * The artwork is additive light on black, so on cream its pale cyan traces come
 * out at barely 1.3:1 and the mark all but vanishes. `brightness` multiplies RGB
 * and leaves alpha untouched, so darkening here deepens the ink of the strokes
 * without filling in the transparent field — the shape survives, the background
 * stays see-through. Saturation is pushed back up because darkening alone drifts
 * the teal toward grey.
 *
 * This is a raster workaround. The vector original (PRD D3) should ship a proper
 * dark-on-light variant and this filter should go with it.
 */
.logo--light .logo__mark {
  filter: contrast(1.6) saturate(2) brightness(0.55);
}

/* Dark plate for light surfaces, matching the ink icon tiles used elsewhere. */
.logo--plated .logo__mark {
  background-color: var(--ink);
  border-radius: var(--radius-chip);
  padding: var(--space-1);
  box-sizing: content-box;
}

/* On an ink band, "Entitle" inherits this — the split is handled by the base
   rules above, so there is no per-tone wordmark colour to keep in sync. */
.logo--inverse {
  color: var(--text-on-ink);
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
