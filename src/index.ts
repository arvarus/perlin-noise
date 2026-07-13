/**
 * @arvarus/perlin-noise
 * Perlin noise implementation in TypeScript
 */

import { generateGradientGrid } from './grid';
import type { GradientVector } from './grid';
import { calculateScalarValues } from './scalar';
import { interpolateScalarValues } from './interpolation';

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
  private readonly grid: Map<string, GradientVector>;
  private readonly seed: number;
  private readonly gridSize: number[];
  private readonly dimension: number;

  /**
   * Creates a new PerlinNoise instance
   *
   * @param options - Configuration options (seed and grid size)
   */
  constructor(options?: PerlinNoiseOptions) {
    this.seed = options?.seed ?? Math.floor(Math.random() * 1000000);
    this.gridSize = [...(options?.gridSize ?? [64, 64, 64])];
    this.dimension = this.gridSize.length;

    if (this.dimension < 1 || this.dimension > 10) {
      throw new Error(`Grid size array length must be between 1 and 10, got ${this.dimension}`);
    }

    if (this.gridSize.some((size) => !Number.isInteger(size) || size < 1)) {
      throw new Error(`Grid sizes must be positive integers, got [${this.gridSize.join(', ')}]`);
    }

    this.grid = generateGradientGrid(this.dimension, this.gridSize, this.seed);
  }

  /**
   * Generate noise value at given coordinates
   * Supports noise generation for any dimension (1 to 10)
   * Coordinates wrap around the grid bounds, producing a repeating pattern
   *
   * @param coordinates - Array of coordinates, length must match grid dimension
   * @returns Noise value in the range approximately [-1, 1]
   */
  noise(coordinates: number[]): number {
    if (coordinates.length !== this.dimension) {
      throw new Error(
        `Coordinates array length (${coordinates.length}) must match grid dimension (${this.dimension})`,
      );
    }

    const wrappedPoint = coordinates.map((coord, i) => {
      const size = this.gridSize[i];
      return ((coord % size) + size) % size;
    });

    const scalarValues = calculateScalarValues(this.grid, wrappedPoint);
    return interpolateScalarValues(scalarValues, wrappedPoint);
  }

  /**
   * Generate 2D noise value at given coordinates
   * Convenience method over `noise` for the common 2D case (e.g. terrain maps)
   * Requires the instance to have been created with a 2D grid
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns Noise value in the range approximately [-1, 1]
   */
  noise2D(x: number, y: number): number {
    if (this.dimension !== 2) {
      throw new Error(`noise2D requires a 2D grid, but grid dimension is ${this.dimension}`);
    }

    return this.noise([x, y]);
  }
}
