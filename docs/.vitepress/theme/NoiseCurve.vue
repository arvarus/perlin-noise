<script setup lang="ts">
import { PerlinNoise } from '@arvarus/trouz';
import { useData } from 'vitepress';
import { computed, onMounted, ref, watch } from 'vue';

const WIDTH = 640;
const HEIGHT = 180;

const { isDark } = useData();

const seed = ref(7);
const cells = ref(6);
const octaves = ref(1);

const canvas = ref<HTMLCanvasElement | null>(null);

const noise = computed(() => new PerlinNoise({ seed: seed.value, gridSize: [256] }));

function cssVar(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function draw() {
  const el = canvas.value;
  const ctx = el?.getContext('2d');
  if (!el || !ctx) return;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Zero line.
  ctx.strokeStyle = cssVar('--vp-c-divider', '#8884');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT / 2);
  ctx.lineTo(WIDTH, HEIGHT / 2);
  ctx.stroke();

  // Curve.
  ctx.strokeStyle = cssVar('--vp-c-brand-1', '#3a7');
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0; px <= WIDTH; px++) {
    const x = (px / WIDTH) * cells.value;
    const value =
      octaves.value > 1 ? noise.value.fbm([x], { octaves: octaves.value }) : noise.value.noise([x]);
    const y = HEIGHT / 2 - value * (HEIGHT / 2 - 8);
    if (px === 0) ctx.moveTo(px, y);
    else ctx.lineTo(px, y);
  }
  ctx.stroke();
}

onMounted(draw);
watch([seed, cells, octaves, isDark], () => requestAnimationFrame(draw), { flush: 'post' });
</script>

<template>
  <div class="curve">
    <canvas
      ref="canvas"
      :width="WIDTH"
      :height="HEIGHT"
      role="img"
      aria-label="1D Perlin noise curve"
    />
    <form class="controls" @submit.prevent>
      <label>
        Seed
        <input v-model.number="seed" type="number" min="0" step="1" />
      </label>
      <label>
        Cells: {{ cells }}
        <input v-model.number="cells" type="range" min="1" max="24" step="1" />
      </label>
      <label>
        Octaves: {{ octaves }}
        <input v-model.number="octaves" type="range" min="1" max="6" step="1" />
      </label>
    </form>
  </div>
</template>

<style scoped>
.curve {
  margin: 1.5rem 0;
}
canvas {
  width: 100%;
  aspect-ratio: 640 / 180;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}
label {
  display: grid;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}
input[type='number'] {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
input[type='range'] {
  accent-color: var(--vp-c-brand-1);
}
</style>
