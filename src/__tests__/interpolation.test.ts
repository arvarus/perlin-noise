import {
  smoothstep,
  calculateFractionalCoordinates,
  interpolate1D,
  interpolateScalarValues,
  scaleNoiseValue,
} from '../interpolation';

describe('smoothstep', () => {
  it('should return 0 for t = 0', () => {
    expect(smoothstep(0)).toBe(0);
  });

  it('should return 1 for t = 1', () => {
    expect(smoothstep(1)).toBe(1);
  });

  it('should return 0.5 for t = 0.5', () => {
    expect(smoothstep(0.5)).toBe(0.5);
  });

  it('should be symmetric around 0.5', () => {
    const t1 = 0.3;
    const t2 = 0.7;
    const s1 = smoothstep(t1);
    const s2 = smoothstep(t2);
    expect(s1 + s2).toBeCloseTo(1, 10);
  });

  it('should clamp values outside [0, 1]', () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
  });

  it('should have zero derivative at endpoints', () => {
    // Numerical test of derivative near 0
    const h = 0.0001;
    const derivativeAt0 = (smoothstep(h) - smoothstep(0)) / h;
    expect(derivativeAt0).toBeCloseTo(0, 2);

    // Numerical test of derivative near 1
    const derivativeAt1 = (smoothstep(1) - smoothstep(1 - h)) / h;
    expect(derivativeAt1).toBeCloseTo(0, 2);
  });

  it('should be monotonically increasing', () => {
    const values = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    for (let i = 1; i < values.length; i++) {
      expect(smoothstep(values[i])).toBeGreaterThanOrEqual(smoothstep(values[i - 1]));
    }
  });
});

describe('calculateFractionalCoordinates', () => {
  it('should calculate fractional coordinates for a 1D point', () => {
    const point = [2.3];
    const fractional = calculateFractionalCoordinates(point);
    expect(fractional).toHaveLength(1);
    expect(fractional[0]).toBeCloseTo(0.3, 10);
  });

  it('should calculate fractional coordinates for a 2D point', () => {
    const point = [1.7, 3.2];
    const fractional = calculateFractionalCoordinates(point);
    expect(fractional).toHaveLength(2);
    expect(fractional[0]).toBeCloseTo(0.7, 10);
    expect(fractional[1]).toBeCloseTo(0.2, 10);
  });

  it('should return 0 for a point exactly on a grid node', () => {
    const point = [2.0, 3.0];
    const fractional = calculateFractionalCoordinates(point);
    expect(fractional[0]).toBe(0);
    expect(fractional[1]).toBe(0);
  });

  it('should handle negative coordinates', () => {
    const point = [-1.3];
    const fractional = calculateFractionalCoordinates(point);
    // -1.3 is in cell [-2], so fractional coordinate is -1.3 - (-2) = 0.7
    expect(fractional[0]).toBeCloseTo(0.7, 10);
  });

  it('should handle fractional coordinates close to 1', () => {
    const point = [2.99];
    const fractional = calculateFractionalCoordinates(point);
    expect(fractional[0]).toBeCloseTo(0.99, 10);
  });
});

describe('interpolate1D', () => {
  it('should return a0 for t = 0', () => {
    expect(interpolate1D(5, 10, 0)).toBe(5);
  });

  it('should return a1 for t = 1', () => {
    expect(interpolate1D(5, 10, 1)).toBe(10);
  });

  it('should return the average for t = 0.5', () => {
    expect(interpolate1D(0, 10, 0.5)).toBeCloseTo(5, 10);
  });

  it('should interpolate correctly for different values', () => {
    const result = interpolate1D(0, 100, 0.3);
    // For t=0.3, smoothstep(0.3) ≈ 0.216, so result ≈ 0 + 0.216 * 100 = 21.6
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });

  it('should handle negative values', () => {
    expect(interpolate1D(-10, 10, 0.5)).toBeCloseTo(0, 10);
  });

  it('should be symmetric', () => {
    const result1 = interpolate1D(0, 10, 0.3);
    const result2 = interpolate1D(10, 0, 0.7);
    expect(result1).toBeCloseTo(result2, 10);
  });
});

describe('interpolateScalarValues', () => {
  describe('1D interpolation', () => {
    it('should interpolate between 2 scalar values for a 1D point', () => {
      const scalarValues = [5, 10];
      const point = [0.3]; // Fractional coordinate = 0.3
      const result = interpolateScalarValues(scalarValues, point);

      // Should be equivalent to interpolate1D(5, 10, 0.3)
      const expected = interpolate1D(5, 10, 0.3);
      expect(result).toBeCloseTo(expected, 10);
    });

    it('should return the first value for a point at node 0', () => {
      const scalarValues = [5, 10];
      const point = [2.0]; // Exactly at node
      const result = interpolateScalarValues(scalarValues, point);
      expect(result).toBeCloseTo(5, 10);
    });

    it('should return the second value for a point at node 1', () => {
      const scalarValues = [5, 10];
      // Note: for point=[3.0], fractional coordinate is 0, so we're at node of cell [3]
      // But scalar values are for cell [2], so we test with point=[2.999...]
      const point2 = [2.999999];
      const result2 = interpolateScalarValues(scalarValues, point2);
      expect(result2).toBeCloseTo(10, 2);
    });

    it('should throw error if number of values does not match', () => {
      const scalarValues = [5, 10, 15]; // 3 values instead of 2
      const point = [0.5];
      expect(() => interpolateScalarValues(scalarValues, point)).toThrow();
    });
  });

  describe('2D interpolation', () => {
    it('should interpolate between 4 scalar values for a 2D point', () => {
      const scalarValues = [0, 10, 20, 30];
      const point = [0.5, 0.5]; // Cell center
      const result = interpolateScalarValues(scalarValues, point);

      // At center, we should get approximately the average
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(30);
    });

    it('should return corner value for a point exactly on a corner', () => {
      const scalarValues = [5, 10, 15, 20];
      const point = [2.0, 3.0]; // Exactly at corner [2,3]
      const result = interpolateScalarValues(scalarValues, point);
      // Should return the first value (bottom-left corner)
      expect(result).toBeCloseTo(5, 10);
    });

    it('should interpolate correctly for different positions', () => {
      const scalarValues = [0, 1, 2, 3];
      const point = [0.0, 0.0]; // Bottom-left corner
      const result1 = interpolateScalarValues(scalarValues, point);
      expect(result1).toBeCloseTo(0, 10);

      const point2 = [0.999, 0.999]; // Close to top-right corner
      const result2 = interpolateScalarValues(scalarValues, point2);
      expect(result2).toBeCloseTo(3, 1);
    });

    it('should throw error if number of values does not match', () => {
      const scalarValues = [0, 1, 2]; // 3 values instead of 4
      const point = [0.5, 0.5];
      expect(() => interpolateScalarValues(scalarValues, point)).toThrow();
    });
  });

  describe('3D interpolation', () => {
    it('should interpolate between 8 scalar values for a 3D point', () => {
      const scalarValues = [0, 1, 2, 3, 4, 5, 6, 7];
      const point = [0.5, 0.5, 0.5]; // Cell center
      const result = interpolateScalarValues(scalarValues, point);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(7);
    });

    it('should return corner value for a point exactly on a corner', () => {
      const scalarValues = [10, 20, 30, 40, 50, 60, 70, 80];
      const point = [1.0, 2.0, 3.0]; // Exactly at corner
      const result = interpolateScalarValues(scalarValues, point);
      // Should return the first value
      expect(result).toBeCloseTo(10, 10);
    });

    it('should throw error if number of values does not match', () => {
      const scalarValues = [0, 1, 2, 3, 4, 5, 6]; // 7 values instead of 8
      const point = [0.5, 0.5, 0.5];
      expect(() => interpolateScalarValues(scalarValues, point)).toThrow();
    });
  });

  describe('higher dimensions', () => {
    it('should interpolate between 16 scalar values for a 4D point', () => {
      const scalarValues = Array.from({ length: 16 }, (_, i) => i);
      const point = [0.5, 0.5, 0.5, 0.5];
      const result = interpolateScalarValues(scalarValues, point);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(15);
    });

    it('should interpolate between 32 scalar values for a 5D point', () => {
      const scalarValues = Array.from({ length: 32 }, (_, i) => i);
      const point = [0.5, 0.5, 0.5, 0.5, 0.5];
      const result = interpolateScalarValues(scalarValues, point);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(31);
    });
  });

  describe('edge cases', () => {
    it('should handle all identical scalar values', () => {
      const scalarValues = [5, 5, 5, 5];
      const point = [0.7, 0.3];
      const result = interpolateScalarValues(scalarValues, point);
      expect(result).toBe(5);
    });

    it('should handle negative scalar values', () => {
      const scalarValues = [-10, -5, 5, 10];
      const point = [0.5, 0.5];
      const result = interpolateScalarValues(scalarValues, point);
      expect(result).toBeGreaterThan(-10);
      expect(result).toBeLessThan(10);
    });

    it('should handle very large scalar values', () => {
      const scalarValues = [1000, 2000, 3000, 4000];
      const point = [0.5, 0.5];
      const result = interpolateScalarValues(scalarValues, point);
      expect(result).toBeGreaterThan(1000);
      expect(result).toBeLessThan(4000);
    });

    it('should produce consistent results for the same point', () => {
      const scalarValues = [0, 1, 2, 3];
      const point = [0.7, 0.3];

      const result1 = interpolateScalarValues(scalarValues, point);
      const result2 = interpolateScalarValues(scalarValues, point);

      expect(result1).toBeCloseTo(result2, 10);
    });

    it('should produce different results for different points', () => {
      const scalarValues = [0, 1, 2, 3];
      const point1 = [0.1, 0.1];
      const point2 = [0.9, 0.9];

      const result1 = interpolateScalarValues(scalarValues, point1);
      const result2 = interpolateScalarValues(scalarValues, point2);

      expect(result1).not.toBeCloseTo(result2, 10);
    });
  });
});

describe('scaleNoiseValue', () => {
  it('should return unchanged value with scale factor of 1.0', () => {
    expect(scaleNoiseValue(0.5)).toBe(0.5);
    expect(scaleNoiseValue(-0.3)).toBe(-0.3);
    expect(scaleNoiseValue(1.0)).toBe(1.0);
  });

  it('should scale correctly with custom scale factor', () => {
    expect(scaleNoiseValue(0.5, 2.0)).toBe(1.0);
    expect(scaleNoiseValue(0.5, 0.5)).toBe(0.25);
    expect(scaleNoiseValue(-0.5, 2.0)).toBe(-1.0);
  });

  it('should handle scale factor of 0', () => {
    expect(scaleNoiseValue(0.5, 0)).toBe(0);
    expect(scaleNoiseValue(-0.3, 0)).toBeCloseTo(0, 10);
  });

  it('should handle negative values', () => {
    expect(scaleNoiseValue(-0.5, 2.0)).toBe(-1.0);
    expect(scaleNoiseValue(-1.0, 0.5)).toBe(-0.5);
  });
});
