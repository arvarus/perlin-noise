/**
 * Grid generation for Perlin noise
 * Generates a grid with random gradient vectors at each intersection
 */

export type GridDimension = number;
export type GradientVector = number | number[];

/**
 * Generates a random number between min and max (inclusive)
 */
function randomRange(min: number, max: number, rng: () => number): number {
  return min + rng() * (max - min);
}

/**
 * Generates a random number between 0 and 1 using a seeded random number generator
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
 */
function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) {
    return vector.map(() => 0);
  }
  return vector.map(val => val / magnitude);
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
 * Recursively generates all coordinate combinations for a given dimension
 */
function generateCoordinates(
  dimension: number,
  gridPoints: number[],
  currentCoords: number[] = [],
): number[][] {
  if (currentCoords.length === dimension) {
    return [currentCoords];
  }

  const coordinates: number[][] = [];
  const currentDim = currentCoords.length;
  const pointsForThisDim = gridPoints[currentDim];
  for (let i = 0; i < pointsForThisDim; i++) {
    const newCoords = [...currentCoords, i];
    coordinates.push(...generateCoordinates(dimension, gridPoints, newCoords));
  }

  return coordinates;
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
  dimension: GridDimension,
  size: number[],
  seed: number = Math.floor(Math.random() * 1000000),
): Map<string, GradientVector> {
  const grid = new Map<string, GradientVector>();
  const rng = createSeededRNG(seed);

  if (!Number.isInteger(dimension) || dimension < 1) {
    throw new Error(`Dimension must be a positive integer, got ${dimension}`);
  }

  if (size.length !== dimension) {
    throw new Error(`Size array length (${size.length}) must match dimension (${dimension})`);
  }

  // Calculate the number of grid points for each dimension (size + 1 for intersections)
  const gridPoints = size.map(s => s + 1);

  const coordinates = generateCoordinates(dimension, gridPoints);

  for (const coord of coordinates) {
    const key = coord.join(',');
    let gradient: GradientVector;

    if (dimension === 1) {
      // 1D case: random scalars between -1 and 1
      gradient = randomRange(-1, 1, rng);
    } else {
      // Multi-dimensional case: unit-length vectors
      const vector = generateUnitGradient(dimension, rng);
      gradient = vector;
    }

    grid.set(key, gradient);
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
  const key = coordinates.join(',');
  return grid.get(key);
}
