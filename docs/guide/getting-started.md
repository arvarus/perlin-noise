# Getting started

## Install

```bash
npm install @arvarus/trouz
```

trouz ships both ES modules and CommonJS, with TypeScript declarations for each, and needs Node.js 18 or later.

```ts
import { PerlinNoise } from '@arvarus/trouz'; // ESM
// const { PerlinNoise } = require('@arvarus/trouz'); // CommonJS
```

## Your first noise value

```ts
const noise = new PerlinNoise({
  seed: 42, // optional: same seed, same pattern
  gridSize: [64, 64], // optional: one size per dimension (default: [64, 64, 64])
});

const value = noise.noise([10.5, 20.3]); // approximately in [-1, 1]
```

The number of entries in `gridSize` is the number of dimensions, from 1 to 10. `noise()` then expects one coordinate per dimension. For the common 2D case, `noise2D(x, y)` is a shorthand.

## Natural-looking terrain

A single octave of noise looks smooth and blobby. Summing several octaves at increasing frequencies and decreasing amplitudes (fractional Brownian motion) gives irregular, natural shapes:

```ts
const noise = new PerlinNoise({ seed: 42, gridSize: [64, 64] });

const elevation = noise.fbm2D(x, y, { octaves: 5, lacunarity: 2, persistence: 0.5 });
const terrain = elevation < -0.1 ? 'sea' : elevation < 0.3 ? 'land' : 'mountain';
```

| Option        | Default | Effect                                                            |
| ------------- | ------- | ----------------------------------------------------------------- |
| `octaves`     | `4`     | Number of layers. More octaves add finer detail, at a higher cost |
| `lacunarity`  | `2`     | Frequency multiplier between octaves                              |
| `persistence` | `0.5`   | Amplitude multiplier between octaves. Lower is smoother           |

The result is normalized, so it stays in the same range as `noise()`. Use the [playground](./playground) to see each option at work.

## Reproducible and tileable

```ts
const a = new PerlinNoise({ seed: 42, gridSize: [64, 64] });
const b = new PerlinNoise({ seed: 42, gridSize: [64, 64] });

a.noise([5.5, 5.5]) === b.noise([5.5, 5.5]); // true
```

Coordinates wrap around the grid: with `gridSize: [16, 16]`, `noise([17.5, 3])` equals `noise([1.5, 3])`. Use a small grid when you want a texture that repeats seamlessly.

## Errors

The constructor throws if `gridSize` has fewer than 1 or more than 10 entries, or anything other than positive integers. `noise()` throws if the number of coordinates does not match the grid dimension, and `noise2D()` and `fbm2D()` throw on a grid that is not 2D. See the [API reference](/reference/api/) for the full contract.
