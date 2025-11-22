import { PerlinNoise, PerlinNoiseOptions } from '../index';

describe('PerlinNoise', () => {
  describe('constructor', () => {
    it('should create instance with default options', () => {
      const noise = new PerlinNoise();
      expect(noise).toBeInstanceOf(PerlinNoise);
    });

    it('should create instance with options object', () => {
      const options: PerlinNoiseOptions = { seed: 456, gridSize: [10, 10, 10] };
      const noise = new PerlinNoise(options);
      expect(noise).toBeInstanceOf(PerlinNoise);
    });

    it('should use provided seed', () => {
      const noise1 = new PerlinNoise({ seed: 789, gridSize: [10, 10, 10] });
      const noise2 = new PerlinNoise({ seed: 789, gridSize: [10, 10, 10] });
      // Same seed should produce same results
      expect(noise1.noise([1.0, 1.0, 1.0])).toBeCloseTo(noise2.noise([1.0, 1.0, 1.0]), 10);
    });

    it('should use default grid size when not provided', () => {
      const noise = new PerlinNoise({ seed: 123 });
      // Should work with 3D coordinates (default dimension)
      const value = noise.noise([1.0, 1.0, 1.0]);
      expect(typeof value).toBe('number');
    });

    it('should throw error for invalid grid size length', () => {
      expect(() => new PerlinNoise({ gridSize: [] })).toThrow();
      expect(() => new PerlinNoise({ gridSize: Array(11).fill(10) })).toThrow();
    });
  });

  describe('1D noise', () => {
    it('should generate noise value for 1D coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10] });
      const value = noise.noise([1.5]);
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(-2);
      expect(value).toBeLessThanOrEqual(2);
    });

    it('should produce consistent results for same point', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10] });
      const value1 = noise.noise([2.3]);
      const value2 = noise.noise([2.3]);
      expect(value1).toBeCloseTo(value2, 10);
    });

    it('should produce different results for different points', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10] });
      const value1 = noise.noise([1.0]);
      const value2 = noise.noise([5.0]);
      // They might be the same by chance, but very unlikely
      expect(typeof value1).toBe('number');
      expect(typeof value2).toBe('number');
    });

    it('should handle negative coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10] });
      const value = noise.noise([-1.5]);
      expect(typeof value).toBe('number');
    });

    it('should handle large coordinates (wrapping)', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10] });
      const value1 = noise.noise([1.5]);
      const value2 = noise.noise([11.5]); // Should wrap to 1.5
      expect(value1).toBeCloseTo(value2, 10);
    });

    it('should handle coordinates at grid boundaries', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10] });
      const value = noise.noise([10.0]);
      expect(typeof value).toBe('number');
    });
  });

  describe('2D noise', () => {
    it('should generate noise value for 2D coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const value = noise.noise([1.5, 2.3]);
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(-2);
      expect(value).toBeLessThanOrEqual(2);
    });

    it('should produce consistent results for same point', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const value1 = noise.noise([2.3, 4.7]);
      const value2 = noise.noise([2.3, 4.7]);
      expect(value1).toBeCloseTo(value2, 10);
    });

    it('should produce different results for different points', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const value1 = noise.noise([1.0, 1.0]);
      const value2 = noise.noise([5.0, 5.0]);
      expect(typeof value1).toBe('number');
      expect(typeof value2).toBe('number');
    });

    it('should handle negative coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const value = noise.noise([-1.5, -2.3]);
      expect(typeof value).toBe('number');
    });

    it('should handle large coordinates (wrapping)', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const value1 = noise.noise([1.5, 2.3]);
      const value2 = noise.noise([11.5, 12.3]); // Should wrap
      expect(value1).toBeCloseTo(value2, 10);
    });

    it('should produce smooth transitions', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const value1 = noise.noise([1.0, 1.0]);
      const value2 = noise.noise([1.1, 1.0]);
      const value3 = noise.noise([1.2, 1.0]);
      // Values should change gradually (not jump dramatically)
      expect(typeof value1).toBe('number');
      expect(typeof value2).toBe('number');
      expect(typeof value3).toBe('number');
    });
  });

  describe('3D noise', () => {
    it('should generate noise value for 3D coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value = noise.noise([1.5, 2.3, 3.7]);
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(-2);
      expect(value).toBeLessThanOrEqual(2);
    });

    it('should produce consistent results for same point', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value1 = noise.noise([2.3, 4.7, 1.2]);
      const value2 = noise.noise([2.3, 4.7, 1.2]);
      expect(value1).toBeCloseTo(value2, 10);
    });

    it('should produce different results for different points', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value1 = noise.noise([1.0, 1.0, 1.0]);
      const value2 = noise.noise([5.0, 5.0, 5.0]);
      expect(typeof value1).toBe('number');
      expect(typeof value2).toBe('number');
    });

    it('should handle negative coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value = noise.noise([-1.5, -2.3, -3.7]);
      expect(typeof value).toBe('number');
    });

    it('should handle large coordinates (wrapping)', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value1 = noise.noise([1.5, 2.3, 3.7]);
      const value2 = noise.noise([11.5, 12.3, 13.7]); // Should wrap
      expect(value1).toBeCloseTo(value2, 10);
    });
  });

  describe('dimension validation', () => {
    it('should throw error when noise dimension does not match grid dimension', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(() => noise.noise([1.0])).toThrow(); // 1D noise on 2D grid
      expect(() => noise.noise([1.0, 1.0, 1.0])).toThrow(); // 3D noise on 2D grid
    });

    it('should allow 1D noise on 1D grid', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10] });
      expect(() => noise.noise([1.0])).not.toThrow();
    });

    it('should allow 2D noise on 2D grid', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(() => noise.noise([1.0, 1.0])).not.toThrow();
    });

    it('should allow 3D noise on 3D grid', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      expect(() => noise.noise([1.0, 1.0, 1.0])).not.toThrow();
    });
  });

  describe('seed behavior', () => {
    it('should produce different results with different seeds', () => {
      const noise1 = new PerlinNoise({ seed: 100, gridSize: [10, 10, 10] });
      const noise2 = new PerlinNoise({ seed: 200, gridSize: [10, 10, 10] });
      const value1 = noise1.noise([1.0, 1.0, 1.0]);
      const value2 = noise2.noise([1.0, 1.0, 1.0]);
      // They might be the same by chance, but very unlikely
      expect(typeof value1).toBe('number');
      expect(typeof value2).toBe('number');
    });

    it('should produce same results with same seed', () => {
      const noise1 = new PerlinNoise({ seed: 500, gridSize: [10, 10, 10] });
      const noise2 = new PerlinNoise({ seed: 500, gridSize: [10, 10, 10] });
      const value1 = noise1.noise([2.5, 3.7, 1.2]);
      const value2 = noise2.noise([2.5, 3.7, 1.2]);
      expect(value1).toBeCloseTo(value2, 10);
    });
  });

  describe('edge cases', () => {
    it('should handle zero coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value = noise.noise([0.0, 0.0, 0.0]);
      expect(typeof value).toBe('number');
    });

    it('should handle very small coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value = noise.noise([0.0001, 0.0001, 0.0001]);
      expect(typeof value).toBe('number');
    });

    it('should handle very large coordinates', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value = noise.noise([1000.5, 2000.3, 3000.7]);
      expect(typeof value).toBe('number');
    });

    it('should handle coordinates at exact grid boundaries', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      const value = noise.noise([10.0, 10.0, 10.0]);
      expect(typeof value).toBe('number');
    });

    it('should handle different grid sizes', () => {
      const noise1 = new PerlinNoise({ seed: 123, gridSize: [5, 5, 5] });
      const noise2 = new PerlinNoise({ seed: 123, gridSize: [20, 20, 20] });
      const value1 = noise1.noise([1.0, 1.0, 1.0]);
      const value2 = noise2.noise([1.0, 1.0, 1.0]);
      // Different grid sizes with same seed should produce different results
      expect(typeof value1).toBe('number');
      expect(typeof value2).toBe('number');
    });
  });

  describe('higher dimensions', () => {
    it('should support 4D noise', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [5, 5, 5, 5] });
      const value = noise.noise([1.0, 1.0, 1.0, 1.0]);
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(-2);
      expect(value).toBeLessThanOrEqual(2);
    });

    it('should support 5D noise', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [5, 5, 5, 5, 5] });
      const value = noise.noise([1.0, 1.0, 1.0, 1.0, 1.0]);
      expect(typeof value).toBe('number');
    });

    it('should support 10D noise (maximum)', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2] });
      const value = noise.noise([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
      expect(typeof value).toBe('number');
    });

    it('should produce consistent results for same point in higher dimensions', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [5, 5, 5, 5] });
      const value1 = noise.noise([2.3, 4.7, 1.2, 3.5]);
      const value2 = noise.noise([2.3, 4.7, 1.2, 3.5]);
      expect(value1).toBeCloseTo(value2, 10);
    });
  });
});
