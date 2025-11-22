/**
 * @arvarus/perlin-noise
 * Perlin noise implementation in TypeScript
 */

import { generateGradientGrid } from './grid';
import type { GradientVector } from './grid';
import { calculateScalarValues } from './scalar';
import { interpolateScalarValues } from './interpolation';

export { generateGradientGrid, getGradientAt } from './grid';
export type { GridDimension, GradientVector } from './grid';

/**
 * Configuration options for PerlinNoise
 */
export interface PerlinNoiseOptions {
  /**
   * Seed for random number generation
   */
  seed?: number;
  /**
   * Grid size for each dimension (default: [64, 64, 64])
   * The grid will wrap around, so values can be smaller for repeating patterns
   * Supports 1 to 10 dimensions
   */
  gridSize?: number[];
}

/**
 * PerlinNoise class for generating Perlin noise values
 */
export class PerlinNoise {
  private grid: Map<string, GradientVector>;
  private seed: number;
  private gridSize: number[];
  private dimension: number;

  /**
   * Creates a new PerlinNoise instance
   *
   * @param options - Configuration options (seed and grid size)
   */
  constructor(options?: PerlinNoiseOptions) {
    this.seed = options?.seed ?? Math.floor(Math.random() * 1000000);
    // Default to 3D grid with reasonable size to avoid memory issues
    this.gridSize = options?.gridSize ?? [64, 64, 64];
    this.dimension = this.gridSize.length;

    // Validate grid size
    if (this.gridSize.length < 1 || this.gridSize.length > 10) {
      throw new Error(
        `Grid size array length must be between 1 and 10, got ${this.gridSize.length}`,
      );
    }

    // Generate the gradient grid
    this.grid = generateGradientGrid(this.dimension, this.gridSize, this.seed);
  }

  /**
   * Generate noise value at given coordinates
   * Supports noise generation for any dimension (1 to 10)
   *
   * @param coordinates - Array of coordinates, length must match grid dimension
   * @returns Noise value in the range approximately [-1, 1]
   */
  noise(coordinates: number[]): number {
    // Validate coordinates array length matches grid dimension
    if (coordinates.length !== this.dimension) {
      throw new Error(
        `Coordinates array length (${coordinates.length}) must match grid dimension (${this.dimension})`,
      );
    }

    const point = coordinates;

    // Wrap coordinates to grid bounds using modulo
    const wrappedPoint = point.map((coord, i) => {
      const size = this.gridSize[i];
      // Handle negative coordinates
      const wrapped = ((coord % size) + size) % size;
      return wrapped;
    });

    // Calculate scalar values at cell vertices
    const scalarValues = calculateScalarValues(this.grid, wrappedPoint);

    // Interpolate scalar values to get final noise value
    const noiseValue = interpolateScalarValues(scalarValues, wrappedPoint);

    return noiseValue;
  }
}
