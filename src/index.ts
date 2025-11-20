/**
 * @arvarus/perlin-noise
 * Perlin noise implementation in TypeScript
 */

export { generateGradientGrid, getGradientAt } from './grid';
export type { GridDimension, GradientVector } from './grid';

export class PerlinNoise {
  constructor(_seed?: number) {
    // TODO: Implement Perlin noise generator
  }

  /**
   * Generate noise value at given coordinates
   */
  noise(_x: number, _y?: number, _z?: number): number {
    // TODO: Implement noise generation
    return 0;
  }
}
