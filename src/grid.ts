/**
 * Grid generation for Perlin noise
 * Generates a grid with random gradient vectors at each intersection
 */

export type GradientVector = number | number[];

/**
 * Generates a random number between min and max (inclusive)
 */
function randomRange(min: number, max: number, rng: () => number): number {
  return min + rng() * (max - min);
}

/**
 * Creates a seeded pseudo-random number generator returning values in [0, 1)
 */
function createSeededRNG(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Normalizes a vector to unit length
 * A zero vector is returned unchanged (it has no direction)
 */
export function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) {
    return vector.map(() => 0);
  }
  return vector.map((val) => val / magnitude);
}

/**
 * Generates a random unit-length gradient vector for the given dimension
 */
function generateUnitGradient(dimension: number, rng: () => number): number[] {
  const vector: number[] = [];

  for (let i = 0; i < dimension; i++) {
    vector.push(randomRange(-1, 1, rng));
  }

  return normalizeVector(vector);
}

/**
 * Generates a grid with gradient vectors at each intersection
 *
 * @param dimension - The dimension of the grid (any positive integer)
 * @param size - Array of sizes for each dimension (number of cells per dimension)
 * @param seed - Optional seed for random number generation
 * @returns A Map with grid coordinates as keys and gradient vectors as values
 */
export function generateGradientGrid(
  dimension: number,
  size: number[],
  seed: number = Math.floor(Math.random() * 1000000),
): Map<string, GradientVector> {
  if (!Number.isInteger(dimension) || dimension < 1) {
    throw new Error(`Dimension must be a positive integer, got ${dimension}`);
  }

  if (size.length !== dimension) {
    throw new Error(`Size array length (${size.length}) must match dimension (${dimension})`);
  }

  const grid = new Map<string, GradientVector>();
  const rng = createSeededRNG(seed);

  // Number of grid points for each dimension (size + 1 for intersections)
  const gridPoints = size.map((s) => s + 1);
  const totalPoints = gridPoints.reduce((product, points) => product * points, 1);

  // Iterate over every grid intersection in lexicographic order
  // (last dimension varies fastest)
  const coord = new Array<number>(dimension).fill(0);
  for (let n = 0; n < totalPoints; n++) {
    const gradient: GradientVector =
      dimension === 1
        ? // 1D case: random scalars between -1 and 1
          randomRange(-1, 1, rng)
        : // Multi-dimensional case: unit-length vectors
          generateUnitGradient(dimension, rng);

    grid.set(coord.join(','), gradient);

    for (let d = dimension - 1; d >= 0; d--) {
      coord[d]++;
      if (coord[d] < gridPoints[d]) {
        break;
      }
      coord[d] = 0;
    }
  }

  return grid;
}

/**
 * Gets the gradient vector at a specific grid intersection
 *
 * @param grid - The gradient grid
 * @param coordinates - The grid coordinates as an array
 * @returns The gradient vector at the specified coordinates, or undefined if not found
 */
export function getGradientAt(
  grid: Map<string, GradientVector>,
  coordinates: number[],
): GradientVector | undefined {
  return grid.get(coordinates.join(','));
}
