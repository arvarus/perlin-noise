/**
 * Interpolation for Perlin noise
 * Interpolates between the 2^n scalar products calculated at the vertices of the cell
 * containing point P. This ensures that the noise function returns 0 at the grid vertices.
 *
 * The interpolation uses a function whose first derivative is zero at the 2^n grid
 * nodes. This has the effect that the gradient of the resulting noise function at
 * each grid node coincides with the precomputed random gradient vector.
 */

/**
 * Classic smoothstep function used for interpolation
 * This function ensures that the first derivative is zero at the endpoints (0 and 1)
 *
 * @param t - Interpolation value between 0 and 1
 * @returns Interpolated value between 0 and 1
 */
export function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  // Smoothstep formula: t² * (3 - 2t)
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Calculates the fractional coordinates of the point within its cell
 * Fractional coordinates are in the interval [0, 1] for each dimension
 *
 * @param point - Point P as an array of coordinates
 * @returns Array of fractional coordinates within the cell
 */
export function calculateFractionalCoordinates(point: number[]): number[] {
  return point.map((coord) => coord - Math.floor(coord));
}

/**
 * Interpolates between two values using smoothstep
 * For n=1, this function interpolates between a0 at node 0 and a1 at node 1
 * Formula: f(x) = a0 + smoothstep(x) * (a1 - a0) for 0 ≤ x ≤ 1
 *
 * @param a0 - Value at node 0
 * @param a1 - Value at node 1
 * @param t - Interpolation parameter between 0 and 1
 * @returns Interpolated value
 */
export function interpolate1D(a0: number, a1: number, t: number): number {
  const s = smoothstep(t);
  return a0 + s * (a1 - a0);
}

/**
 * Interpolates between the 2^n scalar products calculated at the vertices of the cell
 * containing point P. This function ensures that the noise returns 0 at the grid
 * vertices thanks to the use of smoothstep.
 *
 * The scalar values must follow the vertex ordering produced by
 * `generateCellVertices`: dimension 0 is the least significant bit of the vertex
 * index. The values are reduced pairwise, one dimension at a time, so that each
 * dimension is interpolated with its own fractional coordinate.
 *
 * @param scalarValues - Array of scalar values at the cell vertices (2^n values)
 * @param point - Point P as an array of coordinates
 * @returns Interpolated noise value
 */
export function interpolateScalarValues(scalarValues: number[], point: number[]): number {
  // Check that the number of scalar values corresponds to 2^n where n is the dimension
  const dimension = point.length;
  const expectedCount = 2 ** dimension;

  if (scalarValues.length !== expectedCount) {
    throw new Error(
      `The number of scalar values (${scalarValues.length}) must be equal to 2^${dimension} = ${expectedCount}`,
    );
  }

  const fractionalCoords = calculateFractionalCoordinates(point);

  // After d reduction passes, consecutive values differ only in dimension d,
  // so each pass interpolates one dimension with its fractional coordinate.
  let values = scalarValues;
  for (let d = 0; d < dimension; d++) {
    const t = fractionalCoords[d];
    const reduced: number[] = new Array<number>(values.length / 2);
    for (let i = 0; i < reduced.length; i++) {
      reduced[i] = interpolate1D(values[2 * i], values[2 * i + 1], t);
    }
    values = reduced;
  }

  return values[0];
}
