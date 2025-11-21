/**
 * Scalar calculation for Perlin noise
 * Calculates noise value at a given point by computing dot products
 * between gradient vectors and distance vectors
 */

import { GradientVector, getGradientAt } from './grid';

/**
 * Calculates the dot product between two vectors
 * For 1D case, treats the scalar as a vector of length 1
 */
function dotProduct(gradient: GradientVector, distanceVector: number[]): number {
  if (typeof gradient === 'number') {
    // 1D case: gradient is a scalar, distanceVector has one element
    return gradient * distanceVector[0];
  } else {
    // Multi-dimensional case: both are vectors
    if (gradient.length !== distanceVector.length) {
      throw new Error(
        `Gradient vector length (${gradient.length}) must match distance vector length (${distanceVector.length})`,
      );
    }
    return gradient.reduce((sum, val, i) => sum + val * distanceVector[i], 0);
  }
}

/**
 * Generates all vertices of a hypercube cell in n dimensions
 * Each vertex is represented as an array of coordinates
 * For a cell at [x0, x1, ..., xn], vertices are at [x0 or x0+1, x1 or x1+1, ..., xn or xn+1]
 */
function generateCellVertices(cellCoordinates: number[]): number[][] {
  const dimension = cellCoordinates.length;
  const vertices: number[][] = [];

  // Generate all 2^dimension combinations
  const numVertices = Math.pow(2, dimension);
  for (let i = 0; i < numVertices; i++) {
    const vertex: number[] = [];
    for (let d = 0; d < dimension; d++) {
      // Use bit manipulation to determine if this dimension should be +1
      const bit = (i >> d) & 1;
      vertex.push(cellCoordinates[d] + bit);
    }
    vertices.push(vertex);
  }

  return vertices;
}

/**
 * Calculates the distance vector from point P to a vertex
 */
function calculateDistanceVector(point: number[], vertex: number[]): number[] {
  if (point.length !== vertex.length) {
    throw new Error(
      `Point dimension (${point.length}) must match vertex dimension (${vertex.length})`,
    );
  }
  return point.map((coord, i) => coord - vertex[i]);
}

/**
 * Determines which cell of the grid contains the given point P
 * Returns the cell coordinates (floor of each coordinate)
 */
function findCell(point: number[]): number[] {
  return point.map(coord => Math.floor(coord));
}

/**
 * Calculates the dot product values for all vertices of the cell containing point P
 *
 * @param grid - The gradient grid
 * @param point - The point P as an array of coordinates
 * @returns An array of dot product values, one for each vertex of the cell
 */
export function calculateScalarValues(
  grid: Map<string, GradientVector>,
  point: number[],
): number[] {
  // 1. Determine which cell of the grid contains point P
  const cellCoordinates = findCell(point);

  // 2. Generate all vertices of this cell
  const vertices = generateCellVertices(cellCoordinates);

  // 3. For each vertex, calculate the dot product
  const scalarValues: number[] = [];

  for (const vertex of vertices) {
    // Calculate the distance vector between P and the vertex
    const distanceVector = calculateDistanceVector(point, vertex);

    // Get the gradient vector at the vertex
    const gradient = getGradientAt(grid, vertex);

    if (gradient === undefined) {
      throw new Error(
        `Gradient not found at vertex ${vertex.join(',')}. Point may be outside grid bounds.`,
      );
    }

    // Calculate the dot product between the gradient vector and the distance vector
    const dotProductValue = dotProduct(gradient, distanceVector);
    scalarValues.push(dotProductValue);
  }

  return scalarValues;
}
