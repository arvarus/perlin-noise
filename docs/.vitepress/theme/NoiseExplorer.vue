<script setup lang="ts">
import { PerlinNoise } from '@arvarus/trouz';
import { computed, onMounted, ref, watch } from 'vue';

const SIZE = 128;
const GRID = 64;

const seed = ref(42);
const mode = ref<'noise' | 'fbm'>('fbm');
const cells = ref(4);
const octaves = ref(5);
const lacunarity = ref(2);
const persistence = ref(0.5);
const palette = ref<'terrain' | 'gray'>('terrain');

const canvas = ref<HTMLCanvasElement | null>(null);
const drawMs = ref(0);

// Colour stops as [value in 0..1, r, g, b]; values below each stop use the previous colour.
const TERRAIN: [number, number, number, number][] = [
  [0.0, 22, 62, 120],
  [0.42, 42, 110, 170],
  [0.5, 226, 208, 150],
  [0.53, 96, 150, 72],
  [0.7, 64, 112, 56],
  [0.8, 120, 108, 96],
  [0.92, 170, 166, 160],
  [1.0, 250, 250, 252],
];

function terrainColor(t: number): [number, number, number] {
  for (let i = 1; i < TERRAIN.length; i++) {
    const [t1, r1, g1, b1] = TERRAIN[i];
    if (t <= t1) {
      const [t0, r0, g0, b0] = TERRAIN[i - 1];
      const k = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
      return [r0 + (r1 - r0) * k, g0 + (g1 - g0) * k, b0 + (b1 - b0) * k];
    }
  }
  return [250, 250, 252];
}

const noise = computed(() => new PerlinNoise({ seed: seed.value, gridSize: [GRID, GRID] }));

function draw() {
  const el = canvas.value;
  const ctx = el?.getContext('2d');
  if (!el || !ctx) return;
  const started = performance.now();
  const image = ctx.createImageData(SIZE, SIZE);
  const instance = noise.value;
  const options = {
    octaves: octaves.value,
    lacunarity: lacunarity.value,
    persistence: persistence.value,
  };
  for (let py = 0; py < SIZE; py++) {
    for (let px = 0; px < SIZE; px++) {
      const x = (px / SIZE) * cells.value;
      const y = (py / SIZE) * cells.value;
      const value = mode.value === 'fbm' ? instance.fbm2D(x, y, options) : instance.noise2D(x, y);
      const t = Math.max(0, Math.min(1, (value + 1) / 2));
      const [r, g, b] = palette.value === 'terrain' ? terrainColor(t) : [t * 255, t * 255, t * 255];
      const i = (py * SIZE + px) * 4;
      image.data[i] = r;
      image.data[i + 1] = g;
      image.data[i + 2] = b;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  drawMs.value = Math.round(performance.now() - started);
}

let frame = 0;
function schedule() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(draw);
}

onMounted(draw);
watch([seed, mode, cells, octaves, lacunarity, persistence, palette], schedule);

function randomSeed() {
  seed.value = Math.floor(Math.random() * 1_000_000);
}

const snippet = computed(() => {
  const call =
    mode.value === 'fbm'
      ? `noise.fbm2D(x, y, { octaves: ${octaves.value}, lacunarity: ${lacunarity.value}, persistence: ${persistence.value} })`
      : 'noise.noise2D(x, y)';
  return `const noise = new PerlinNoise({ seed: ${seed.value}, gridSize: [${GRID}, ${GRID}] });\nconst value = ${call}; // x, y in 0..${cells.value}`;
});
</script>

<template>
  <div class="explorer">
    <canvas
      ref="canvas"
      :width="SIZE"
      :height="SIZE"
      role="img"
      aria-label="2D Perlin noise rendered with the selected parameters"
    />
    <form class="controls" @submit.prevent>
      <label>
        Mode
        <select v-model="mode">
          <option value="noise">Single octave</option>
          <option value="fbm">fBm (several octaves)</option>
        </select>
      </label>
      <label>
        Seed
        <span class="row">
          <input v-model.number="seed" type="number" min="0" step="1" />
          <button type="button" @click="randomSeed">Random</button>
        </span>
      </label>
      <label>
        Zoom (cells across): {{ cells }}
        <input v-model.number="cells" type="range" min="1" max="16" step="1" />
      </label>
      <template v-if="mode === 'fbm'">
        <label>
          Octaves: {{ octaves }}
          <input v-model.number="octaves" type="range" min="1" max="8" step="1" />
        </label>
        <label>
          Lacunarity: {{ lacunarity }}
          <input v-model.number="lacunarity" type="range" min="1" max="4" step="1" />
        </label>
        <label>
          Persistence: {{ persistence }}
          <input v-model.number="persistence" type="range" min="0.1" max="1" step="0.05" />
        </label>
      </template>
      <label>
        Palette
        <select v-model="palette">
          <option value="terrain">Terrain</option>
          <option value="gray">Grayscale</option>
        </select>
      </label>
      <p class="hint">Rendered in {{ drawMs }} ms in your browser, by the library itself.</p>
    </form>
    <pre class="snippet"><code>{{ snippet }}</code></pre>
  </div>
</template>

<style scoped>
.explorer {
  display: grid;
  grid-template-columns: minmax(0, 384px) minmax(0, 1fr);
  gap: 1rem 1.5rem;
  margin: 1.5rem 0;
  align-items: start;
}
canvas {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.controls {
  display: grid;
  gap: 0.75rem;
}
label {
  display: grid;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}
.row {
  display: flex;
  gap: 0.5rem;
}
input[type='number'],
select {
  width: 100%;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
button {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}
button:hover {
  border-color: var(--vp-c-brand-1);
}
input[type='range'] {
  accent-color: var(--vp-c-brand-1);
}
.hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}
.snippet {
  grid-column: 1 / -1;
  margin: 0;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 0.8125rem;
}
@media (max-width: 640px) {
  .explorer {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
