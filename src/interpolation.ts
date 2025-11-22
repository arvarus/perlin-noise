/**
 * Interpolation for Perlin noise
 * Interpolates between the 2^n scalar products calculated at the vertices of the cell
 * containing point P. This ensures that the noise function returns 0 at the grid vertices.
 *
 * The interpolation uses a function whose first derivative (and possibly
 * the second derivative) is zero at the 2^n grid nodes. This has the effect that
 * the gradient of the resulting noise function at each grid node coincides
 * with the precomputed random gradient vector.
 */

/**
 * Classic smoothstep function used for interpolation
 * This function ensures that the first derivative is zero at the endpoints (0 and 1)
 *
 * @param t - Interpolation value between 0 and 1
 * @returns Interpolated value between 0 and 1
 */
export function smoothstep(t: number): number {
  // Clamp t between 0 and 1
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
  return point.map(coord => {
    const cellCoord = Math.floor(coord);
    return coord - cellCoord;
  });
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
 * Recursively interpolates between scalar values for a given dimension
 * This function progressively reduces the number of values by interpolating
 * dimension by dimension
 *
 * @param scalarValues - Array of scalar values (2^n values)
 * @param fractionalCoords - Fractional coordinates of the point within the cell
 * @param dimension - Current dimension to interpolate (starts at 0)
 * @returns Final interpolated value
 */
function interpolateRecursive(
  scalarValues: number[],
  fractionalCoords: number[],
  dimension: number = 0,
): number {
  // Base case: if we have a single value, return it
  if (scalarValues.length === 1) {
    return scalarValues[0];
  }

  // If we've reached the last dimension, interpolate between the two remaining values
  if (dimension >= fractionalCoords.length) {
    if (scalarValues.length === 2) {
      return interpolate1D(scalarValues[0], scalarValues[1], fractionalCoords[dimension - 1] || 0);
    }
    // If we have more than 2 values, take the average (should not happen normally)
    return scalarValues.reduce((sum, val) => sum + val, 0) / scalarValues.length;
  }

  const t = fractionalCoords[dimension];
  const numValues = scalarValues.length;
  const valuesPerHalf = numValues / 2;

  // Divide values into two groups for this dimension
  const lowerValues = scalarValues.slice(0, valuesPerHalf);
  const upperValues = scalarValues.slice(valuesPerHalf);

  // Recursively interpolate for each group
  const lowerInterpolated = interpolateRecursive(lowerValues, fractionalCoords, dimension + 1);
  const upperInterpolated = interpolateRecursive(upperValues, fractionalCoords, dimension + 1);

  // Interpolate between the two groups for this dimension
  return interpolate1D(lowerInterpolated, upperInterpolated, t);
}

/**
 * Interpolates between the 2^n scalar products calculated at the vertices of the cell
 * containing point P. This function ensures that the noise returns 0 at the grid
 * vertices thanks to the use of smoothstep.
 *
 * @param scalarValues - Array of scalar values at the cell vertices (2^n values)
 * @param point - Point P as an array of coordinates
 * @returns Interpolated noise value
 */
export function interpolateScalarValues(scalarValues: number[], point: number[]): number {
  // Check that the number of scalar values corresponds to 2^n where n is the dimension
  const dimension = point.length;
  const expectedCount = Math.pow(2, dimension);

  if (scalarValues.length !== expectedCount) {
    throw new Error(
      `The number of scalar values (${scalarValues.length}) must be equal to 2^${dimension} = ${expectedCount}`,
    );
  }

  // Calculate fractional coordinates within the cell
  const fractionalCoords = calculateFractionalCoordinates(point);

  // Recursively interpolate between all values
  return interpolateRecursive(scalarValues, fractionalCoords, 0);
}

/**
 * Scales an interpolated value to be in the interval [-1.0, 1.0]
 * Noise functions used in computer graphics typically produce
 * values within this interval.
 *
 * @param value - Value to scale
 * @param scaleFactor - Scale factor (default 1.0, no scaling)
 * @returns Scaled value
 */
export function scaleNoiseValue(value: number, scaleFactor: number = 1.0): number {
  return value * scaleFactor;
}
