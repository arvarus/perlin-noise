# @arvarus/perlin-noise

[![CI](https://github.com/arvarus/perlin-noise/actions/workflows/ci.yml/badge.svg)](https://github.com/arvarus/perlin-noise/actions/workflows/ci.yml)

Perlin noise implementation in TypeScript, supporting 1 to 10 dimensions.

- **N-dimensional**: generate noise in 1D, 2D, 3D... up to 10D
- **Deterministic**: same seed, same noise pattern
- **Repeating**: coordinates wrap around the grid, producing tileable patterns
- **Zero dependencies**, fully typed, 100% test coverage

## Installation

```bash
npm install @arvarus/perlin-noise
```

## Usage

### Basic Example

```typescript
import { PerlinNoise } from '@arvarus/perlin-noise';

// Create a Perlin noise instance
const noise = new PerlinNoise({
  seed: 42, // Optional: seed for reproducible results
  gridSize: [64, 64], // Optional: grid size per dimension (default: [64, 64, 64])
});

// Generate noise value at coordinates
const value = noise.noise([10.5, 20.3]);
console.log(value); // A value approximately in range [-1, 1]
```

### 1D Noise

```typescript
const noise = new PerlinNoise({
  seed: 123,
  gridSize: [100], // 1D grid
});

// Generate 1D noise along a line
for (let x = 0; x < 10; x += 0.1) {
  const value = noise.noise([x]);
  console.log(`x: ${x}, noise: ${value}`);
}
```

### Natural-Looking Terrain with fBm

For more natural results (irregular coastlines, fine detail), sum several octaves
of noise with fractional Brownian motion:

```typescript
const noise = new PerlinNoise({ seed: 42, gridSize: [8, 16] });

// 4 octaves by default; each octave doubles the frequency and halves the amplitude
const elevation = noise.fbm2D(x, y, { octaves: 4, lacunarity: 2, persistence: 0.5 });

// Map the value to a terrain type
const terrain = elevation < -0.1 ? 'sea' : elevation < 0.3 ? 'land' : 'mountain';
```

### Using a Fixed Seed for Reproducible Results

```typescript
// Same seed produces same noise pattern
const noise1 = new PerlinNoise({ seed: 42, gridSize: [64, 64] });
const noise2 = new PerlinNoise({ seed: 42, gridSize: [64, 64] });

const value1 = noise1.noise([5.5, 5.5]);
const value2 = noise2.noise([5.5, 5.5]);

console.log(value1 === value2); // true - same seed produces same result
```

## Examples

Runnable examples live in the [examples/](examples/) directory:

```bash
npm run example:basic # Minimal 1D/2D/3D usage, seeding and wrapping
npm run example:ascii # Renders a 2D noise field as ASCII art in the terminal
npm run example:image # Writes a 256x256 grayscale image (examples/noise.pgm)
```

## API Reference

### `PerlinNoise`

Main class for generating Perlin noise values. Supports 1 to 10 dimensions.

#### Constructor

```typescript
new PerlinNoise(options?: PerlinNoiseOptions)
```

Creates a new PerlinNoise instance.

**Parameters:**

- `options` (optional): Configuration object
  - `seed?: number` - Seed for random number generation. If not provided, a random seed is used.
  - `gridSize?: number[]` - Grid size for each dimension. Default: `[64, 64, 64]`. Each size must be a positive integer, and the array length (the dimension) must be between 1 and 10. The grid wraps around, so smaller values can be used for repeating patterns.

**Example:**

```typescript
// Default 3D noise
const noise1 = new PerlinNoise();

// 2D noise with fixed seed
const noise2 = new PerlinNoise({ seed: 42, gridSize: [64, 64] });

// 1D noise
const noise3 = new PerlinNoise({ gridSize: [100] });
```

**Throws:**

- `Error` - If `gridSize` has fewer than 1 or more than 10 entries, or contains anything other than positive integers

#### Methods

##### `noise(coordinates: number[]): number`

Generates a noise value at the given coordinates.

**Parameters:**

- `coordinates: number[]` - Array of coordinates. The length must match the grid dimension specified in the constructor.

**Returns:**

- `number` - Noise value approximately in the range `[-1, 1]`. The value is exactly `0` at integer grid coordinates, as expected from Perlin noise.

**Example:**

```typescript
const noise = new PerlinNoise({ gridSize: [64, 64] });

// 2D coordinates for 2D grid
const value = noise.noise([10.5, 20.3]);

// Coordinates wrap around the grid bounds
const wrapped = noise.noise([100.0, 200.0]); // Wraps to [36, 8] for 64x64 grid
```

**Throws:**

- `Error` - If the coordinates array length doesn't match the grid dimension

##### `noise2D(x: number, y: number): number`

Convenience method over `noise` for the common 2D case (e.g. terrain maps). Requires the instance to have been created with a 2D grid.

**Parameters:**

- `x: number` - X coordinate
- `y: number` - Y coordinate

**Returns:**

- `number` - Noise value approximately in the range `[-1, 1]`, identical to `noise([x, y])`

**Throws:**

- `Error` - If the grid dimension is not 2

##### `fbm(coordinates: number[], options?: FBMOptions): number`

Generates a fractional Brownian motion (fBm) value by summing several octaves of noise at increasing frequencies and decreasing amplitudes. Produces more natural-looking results than a single octave (e.g. irregular coastlines on terrain maps).

**Parameters:**

- `coordinates: number[]` - Array of coordinates. The length must match the grid dimension specified in the constructor.
- `options` (optional): fBm configuration
  - `octaves?: number` - Number of noise layers to sum. Default: `4`. Must be a positive integer.
  - `lacunarity?: number` - Frequency multiplier between successive octaves. Default: `2`. Must be positive. With integer values the summed noise still wraps seamlessly.
  - `persistence?: number` - Amplitude multiplier between successive octaves. Default: `0.5`. Must be positive.

**Returns:**

- `number` - fBm value normalized by the total amplitude, approximately in the range `[-1, 1]`

**Example:**

```typescript
const noise = new PerlinNoise({ gridSize: [64, 64] });

const value = noise.fbm([10.5, 20.3], { octaves: 6, persistence: 0.4 });
```

**Throws:**

- `Error` - If `octaves` is not a positive integer, or `lacunarity` or `persistence` is not a positive number
- `Error` - If the coordinates array length doesn't match the grid dimension

##### `fbm2D(x: number, y: number, options?: FBMOptions): number`

Convenience method over `fbm` for the common 2D case. Requires the instance to have been created with a 2D grid.

**Parameters:**

- `x: number` - X coordinate
- `y: number` - Y coordinate
- `options` (optional): Same fBm configuration as `fbm`

**Returns:**

- `number` - fBm value approximately in the range `[-1, 1]`, identical to `fbm([x, y], options)`

**Throws:**

- `Error` - If the grid dimension is not 2, or if the options are invalid

### `PerlinNoiseOptions`

Configuration interface for the `PerlinNoise` constructor.

```typescript
interface PerlinNoiseOptions {
  seed?: number;
  gridSize?: number[];
}
```

**Properties:**

- `seed?: number` - Seed for random number generation. Same seed produces the same noise pattern.
- `gridSize?: number[]` - Grid size for each dimension. Default: `[64, 64, 64]`. Must be an array of 1 to 10 positive integers. The grid wraps around, allowing for repeating patterns.

### `FBMOptions`

Configuration interface for the `fbm` and `fbm2D` methods.

```typescript
interface FBMOptions {
  octaves?: number;
  lacunarity?: number;
  persistence?: number;
}
```

**Properties:**

- `octaves?: number` - Number of noise layers to sum. Default: `4`. More octaves add finer detail at increasing computational cost.
- `lacunarity?: number` - Frequency multiplier between successive octaves. Default: `2`.
- `persistence?: number` - Amplitude multiplier between successive octaves. Default: `0.5`. Lower values make higher octaves fade faster, giving smoother results.

## Migrating from 0.x

- **Noise values changed**: version 0.x interpolated dimensions in reversed order, which made the noise discontinuous across cell boundaries. This is fixed in 1.0, so values generated for a given seed differ from 0.x.
- **Trimmed exports**: the internal helpers `generateGradientGrid`, `getGradientAt`, `GridDimension` and `GradientVector` are no longer exported from the package root. The public API is `PerlinNoise`, `PerlinNoiseOptions` and `FBMOptions`.

## Development

```bash
npm install
npm test              # Run the test suite
npm run test:coverage # Run tests with coverage (100% enforced)
npm run lint          # ESLint
npm run format        # Prettier
npm run build         # Compile to dist/
```

## License

GPL-3.0
