# @arvarus/perlin-noise

Perlin noise implementation in TypeScript.

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
  seed: 42,           // Optional: seed for reproducible results
  gridSize: [64, 64]  // Optional: grid size for each dimension (default: [64, 64, 64])
});

// Generate noise value at coordinates
const value = noise.noise([10.5, 20.3]);
console.log(value); // Output: a value approximately in range [-1, 1]
```

### 1D Noise

```typescript
const noise = new PerlinNoise({ 
  seed: 123, 
  gridSize: [100]  // 1D grid
});

// Generate 1D noise along a line
for (let x = 0; x < 10; x += 0.1) {
  const value = noise.noise([x]);
  console.log(`x: ${x}, noise: ${value}`);
}
```

### Using a Fixed Seed for Reproducible Results

```typescript
// Same seed produces same noise pattern
const noise1 = new PerlinNoise({ seed: 42, gridSize: [64, 64] });
const noise2 = new PerlinNoise({ seed: 42, gridSize: [64, 64] });

const value1 = noise1.noise([5.0, 5.0]);
const value2 = noise2.noise([5.0, 5.0]);

console.log(value1 === value2); // true - same seed produces same result
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
  - `gridSize?: number[]` - Grid size for each dimension. Default: `[64, 64, 64]`. The grid wraps around, so smaller values can be used for repeating patterns. Must be an array of length 1 to 10.

**Example:**
```typescript
// Default 3D noise
const noise1 = new PerlinNoise();

// 2D noise with fixed seed
const noise2 = new PerlinNoise({ seed: 42, gridSize: [64, 64] });

// 1D noise
const noise3 = new PerlinNoise({ gridSize: [100] });
```

#### Methods

##### `noise(coordinates: number[]): number`

Generates a noise value at the given coordinates.

**Parameters:**
- `coordinates: number[]` - Array of coordinates. The length must match the grid dimension specified in the constructor.

**Returns:**
- `number` - Noise value approximately in the range `[-1, 1]`

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

### `PerlinNoiseOptions`

Configuration interface for PerlinNoise constructor.

```typescript
interface PerlinNoiseOptions {
  seed?: number;
  gridSize?: number[];
}
```

**Properties:**
- `seed?: number` - Seed for random number generation. Same seed produces the same noise pattern.
- `gridSize?: number[]` - Grid size for each dimension. Default: `[64, 64, 64]`. Must be an array of length 1 to 10. The grid wraps around, allowing for seamless repeating patterns.

## License

GPL-3.0

