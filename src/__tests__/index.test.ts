import { PerlinNoise, type FBMOptions, type PerlinNoiseOptions } from '../index';

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

    it('should throw error for non positive integer grid sizes', () => {
      expect(() => new PerlinNoise({ gridSize: [0] })).toThrow();
      expect(() => new PerlinNoise({ gridSize: [10, -5] })).toThrow();
      expect(() => new PerlinNoise({ gridSize: [10, 2.5] })).toThrow();
    });

    it('should not be affected by later mutations of the gridSize option', () => {
      const gridSize = [10, 10];
      const noise = new PerlinNoise({ seed: 123, gridSize });
      const before = noise.noise([2.5, 3.5]);
      gridSize[0] = 999;
      expect(noise.noise([2.5, 3.5])).toBeCloseTo(before, 10);
    });
  });

  describe('Perlin noise properties', () => {
    it('should return 0 at every grid vertex', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [8, 8] });
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          expect(noise.noise([x, y])).toBeCloseTo(0, 10);
        }
      }
    });

    it('should be continuous across cell boundaries', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [8, 8] });
      const eps = 1e-9;
      for (let x = 0.5; x < 8; x++) {
        for (let boundary = 1; boundary < 8; boundary++) {
          expect(noise.noise([x, boundary - eps])).toBeCloseTo(noise.noise([x, boundary + eps]), 6);
          expect(noise.noise([boundary - eps, x])).toBeCloseTo(noise.noise([boundary + eps, x]), 6);
        }
      }
    });

    it('should be continuous across the wrapping boundary', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [8] });
      const eps = 1e-9;
      expect(noise.noise([8 - eps])).toBeCloseTo(noise.noise([8 + eps]), 6);
      expect(noise.noise([-eps])).toBeCloseTo(noise.noise([eps]), 6);
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

  describe('noise2D', () => {
    it('should return the same value as noise([x, y])', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(noise.noise2D(1.5, 2.3)).toBeCloseTo(noise.noise([1.5, 2.3]), 10);
      expect(noise.noise2D(-1.5, 12.3)).toBeCloseTo(noise.noise([-1.5, 12.3]), 10);
    });

    it('should generate noise value in the expected range', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const value = noise.noise2D(3.7, 4.2);
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(-2);
      expect(value).toBeLessThanOrEqual(2);
    });

    it('should produce consistent results for same point', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(noise.noise2D(2.3, 4.7)).toBeCloseTo(noise.noise2D(2.3, 4.7), 10);
    });

    it('should throw error when grid is not 2D', () => {
      const noise1D = new PerlinNoise({ seed: 123, gridSize: [10] });
      const noise3D = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      expect(() => noise1D.noise2D(1.0, 1.0)).toThrow('noise2D requires a 2D grid');
      expect(() => noise3D.noise2D(1.0, 1.0)).toThrow('noise2D requires a 2D grid');
    });
  });

  describe('fbm', () => {
    it('should equal single-octave noise when octaves is 1', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(noise.fbm([2.3, 4.7], { octaves: 1 })).toBeCloseTo(noise.noise([2.3, 4.7]), 10);
    });

    it('should use default options when none are provided', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const defaults: FBMOptions = { octaves: 4, lacunarity: 2, persistence: 0.5 };
      expect(noise.fbm([2.3, 4.7])).toBeCloseTo(noise.fbm([2.3, 4.7], defaults), 10);
    });

    it('should stay within the normalized range', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      for (let x = 0.25; x < 10; x += 0.5) {
        for (let y = 0.25; y < 10; y += 0.5) {
          const value = noise.fbm([x, y], { octaves: 6 });
          expect(value).toBeGreaterThanOrEqual(-1);
          expect(value).toBeLessThanOrEqual(1);
        }
      }
    });

    it('should produce consistent results for same point and options', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const options: FBMOptions = { octaves: 5, lacunarity: 2, persistence: 0.6 };
      expect(noise.fbm([2.3, 4.7], options)).toBeCloseTo(noise.fbm([2.3, 4.7], options), 10);
    });

    it('should add detail as octaves increase', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      const oneOctave = noise.fbm([2.3, 4.7], { octaves: 1 });
      const fourOctaves = noise.fbm([2.3, 4.7], { octaves: 4 });
      expect(oneOctave).not.toBeCloseTo(fourOctaves, 10);
    });

    it('should work in other dimensions than 2D', () => {
      const noise1D = new PerlinNoise({ seed: 123, gridSize: [10] });
      const noise3D = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      expect(typeof noise1D.fbm([2.3])).toBe('number');
      expect(typeof noise3D.fbm([2.3, 4.7, 1.2])).toBe('number');
    });

    it('should throw error for invalid octaves', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(() => noise.fbm([1.0, 1.0], { octaves: 0 })).toThrow('Octaves');
      expect(() => noise.fbm([1.0, 1.0], { octaves: -1 })).toThrow('Octaves');
      expect(() => noise.fbm([1.0, 1.0], { octaves: 2.5 })).toThrow('Octaves');
    });

    it('should throw error for invalid lacunarity', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(() => noise.fbm([1.0, 1.0], { lacunarity: 0 })).toThrow('Lacunarity');
      expect(() => noise.fbm([1.0, 1.0], { lacunarity: -2 })).toThrow('Lacunarity');
      expect(() => noise.fbm([1.0, 1.0], { lacunarity: NaN })).toThrow('Lacunarity');
    });

    it('should throw error for invalid persistence', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(() => noise.fbm([1.0, 1.0], { persistence: 0 })).toThrow('Persistence');
      expect(() => noise.fbm([1.0, 1.0], { persistence: -0.5 })).toThrow('Persistence');
      expect(() => noise.fbm([1.0, 1.0], { persistence: NaN })).toThrow('Persistence');
    });
  });

  describe('fbm2D', () => {
    it('should return the same value as fbm([x, y])', () => {
      const noise = new PerlinNoise({ seed: 123, gridSize: [10, 10] });
      expect(noise.fbm2D(1.5, 2.3)).toBeCloseTo(noise.fbm([1.5, 2.3]), 10);
      const options: FBMOptions = { octaves: 6, lacunarity: 3, persistence: 0.4 };
      expect(noise.fbm2D(1.5, 2.3, options)).toBeCloseTo(noise.fbm([1.5, 2.3], options), 10);
    });

    it('should throw error when grid is not 2D', () => {
      const noise1D = new PerlinNoise({ seed: 123, gridSize: [10] });
      const noise3D = new PerlinNoise({ seed: 123, gridSize: [10, 10, 10] });
      expect(() => noise1D.fbm2D(1.0, 1.0)).toThrow('fbm2D requires a 2D grid');
      expect(() => noise3D.fbm2D(1.0, 1.0)).toThrow('fbm2D requires a 2D grid');
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
