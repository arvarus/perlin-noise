---
layout: home

hero:
  name: trouz
  text: Procedural noise in TypeScript
  tagline: Breton for "noise". Perlin noise from 1 to 10 dimensions, seeded, tileable, zero dependencies.
  actions:
    - theme: brand
      text: Getting started
      link: /guide/getting-started
    - theme: alt
      text: Playground
      link: /guide/playground
    - theme: alt
      text: API reference
      link: /reference/api/

features:
  - title: N-dimensional
    details: One class for 1D curves, 2D terrain maps, 3D volumes, and up to 10 dimensions.
  - title: Deterministic
    details: The same seed always gives the same noise, on any machine.
  - title: Tileable
    details: Coordinates wrap around the grid, so patterns repeat seamlessly.
  - title: Natural-looking
    details: Built-in fractional Brownian motion (fBm) for coastlines, clouds and mountains.
  - title: ESM and CommonJS
    details: Fully typed, with both module formats and no runtime dependency.
  - title: Fully tested
    details: 100% test coverage enforced in CI.
---

<script setup>
import NoiseExplorer from './.vitepress/theme/NoiseExplorer.vue'
</script>

## Try it

This terrain is generated live, in your browser, by the library itself.

<NoiseExplorer />
