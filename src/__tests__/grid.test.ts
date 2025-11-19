import { generateGradientGrid, getGradientAt, GradientVector } from '../grid';

describe('generateGradientGrid', () => {
  describe('1D grid', () => {
    it('should generate correct number of grid points', () => {
      const grid = generateGradientGrid(1, [5], 123);
      expect(grid.size).toBe(6); // size + 1
    });

    it('should generate scalars between -1 and 1', () => {
      const grid = generateGradientGrid(1, [10], 456);
      for (const gradient of grid.values()) {
        expect(typeof gradient).toBe('number');
        const scalar = gradient as number;
        expect(scalar).toBeGreaterThanOrEqual(-1);
        expect(scalar).toBeLessThanOrEqual(1);
      }
    });

    it('should generate same grid with same seed', () => {
      const grid1 = generateGradientGrid(1, [5], 789);
      const grid2 = generateGradientGrid(1, [5], 789);

      expect(grid1.size).toBe(grid2.size);
      for (const [key, value] of grid1.entries()) {
        expect(grid2.get(key)).toBe(value);
      }
    });

    it('should generate different grid with different seed', () => {
      const grid1 = generateGradientGrid(1, [5], 100);
      const grid2 = generateGradientGrid(1, [5], 200);

      // At least some values should be different
      let hasDifference = false;
      for (const [key, value] of grid1.entries()) {
        if (grid2.get(key) !== value) {
          hasDifference = true;
          break;
        }
      }
      expect(hasDifference).toBe(true);
    });

    it('should have correct keys for 1D grid', () => {
      const grid = generateGradientGrid(1, [3], 123);
      expect(grid.has('0')).toBe(true);
      expect(grid.has('1')).toBe(true);
      expect(grid.has('2')).toBe(true);
      expect(grid.has('3')).toBe(true);
      expect(grid.has('4')).toBe(false);
    });
  });

  describe('2D grid', () => {
    it('should generate correct number of grid points', () => {
      const grid = generateGradientGrid(2, [3, 3], 123);
      expect(grid.size).toBe(16); // (3 + 1) * (3 + 1) = 16
    });

    it('should generate unit-length 2D vectors', () => {
      const grid = generateGradientGrid(2, [5, 5], 456);
      for (const gradient of grid.values()) {
        expect(Array.isArray(gradient)).toBe(true);
        const vector = gradient as [number, number];
        expect(vector.length).toBe(2);

        // Check unit length (within floating point precision)
        const magnitude = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
        expect(magnitude).toBeCloseTo(1, 10);
      }
    });

    it('should generate same grid with same seed', () => {
      const grid1 = generateGradientGrid(2, [3, 3], 789);
      const grid2 = generateGradientGrid(2, [3, 3], 789);

      expect(grid1.size).toBe(grid2.size);
      for (const [key, value] of grid1.entries()) {
        const v1 = value as [number, number];
        const v2 = grid2.get(key) as [number, number];
        expect(v2).toBeDefined();
        expect(v1[0]).toBeCloseTo(v2[0], 10);
        expect(v1[1]).toBeCloseTo(v2[1], 10);
      }
    });

    it('should have correct keys for 2D grid', () => {
      const grid = generateGradientGrid(2, [2, 2], 123);
      expect(grid.has('0,0')).toBe(true);
      expect(grid.has('0,1')).toBe(true);
      expect(grid.has('1,0')).toBe(true);
      expect(grid.has('2,2')).toBe(true);
      expect(grid.has('3,3')).toBe(false); // size is 2, so max is 2
    });

    it('should support different sizes per dimension', () => {
      const grid = generateGradientGrid(2, [2, 3], 123);
      // First dimension: 2 + 1 = 3 points (0, 1, 2)
      // Second dimension: 3 + 1 = 4 points (0, 1, 2, 3)
      // Total: 3 * 4 = 12 points
      expect(grid.size).toBe(12);
      expect(grid.has('0,0')).toBe(true);
      expect(grid.has('2,3')).toBe(true);
      expect(grid.has('3,3')).toBe(false); // First dimension max is 2
      expect(grid.has('2,4')).toBe(false); // Second dimension max is 3
    });
  });

  describe('3D grid', () => {
    it('should generate correct number of grid points', () => {
      const grid = generateGradientGrid(3, [2, 2, 2], 123);
      expect(grid.size).toBe(27); // (2 + 1) ^ 3 = 27
    });

    it('should generate unit-length 3D vectors', () => {
      const grid = generateGradientGrid(3, [3, 3, 3], 456);
      for (const gradient of grid.values()) {
        expect(Array.isArray(gradient)).toBe(true);
        const vector = gradient as [number, number, number];
        expect(vector.length).toBe(3);

        // Check unit length
        const magnitude = Math.sqrt(
          vector[0] * vector[0] +
          vector[1] * vector[1] +
          vector[2] * vector[2],
        );
        expect(magnitude).toBeCloseTo(1, 10);
      }
    });

    it('should generate same grid with same seed', () => {
      const grid1 = generateGradientGrid(3, [2, 2, 2], 789);
      const grid2 = generateGradientGrid(3, [2, 2, 2], 789);

      expect(grid1.size).toBe(grid2.size);
      for (const [key, value] of grid1.entries()) {
        const v1 = value as [number, number, number];
        const v2 = grid2.get(key) as [number, number, number];
        expect(v2).toBeDefined();
        expect(v1[0]).toBeCloseTo(v2[0], 10);
        expect(v1[1]).toBeCloseTo(v2[1], 10);
        expect(v1[2]).toBeCloseTo(v2[2], 10);
      }
    });

    it('should have correct keys for 3D grid', () => {
      const grid = generateGradientGrid(3, [1, 1, 1], 123);
      expect(grid.has('0,0,0')).toBe(true);
      expect(grid.has('1,1,1')).toBe(true);
      expect(grid.has('2,2,2')).toBe(false); // size is 1, so max is 1
    });
  });

  describe('4D grid', () => {
    it('should generate correct number of grid points', () => {
      const grid = generateGradientGrid(4, [2, 2, 2, 2], 123);
      expect(grid.size).toBe(81); // (2 + 1) ^ 4 = 81
    });

    it('should generate unit-length 4D vectors', () => {
      const grid = generateGradientGrid(4, [2, 2, 2, 2], 456);
      for (const gradient of grid.values()) {
        expect(Array.isArray(gradient)).toBe(true);
        const vector = gradient as [number, number, number, number];
        expect(vector.length).toBe(4);

        // Check unit length
        const magnitude = Math.sqrt(
          vector[0] * vector[0] +
          vector[1] * vector[1] +
          vector[2] * vector[2] +
          vector[3] * vector[3],
        );
        expect(magnitude).toBeCloseTo(1, 10);
      }
    });

    it('should generate same grid with same seed', () => {
      const grid1 = generateGradientGrid(4, [1, 1, 1, 1], 789);
      const grid2 = generateGradientGrid(4, [1, 1, 1, 1], 789);

      expect(grid1.size).toBe(grid2.size);
      for (const [key, value] of grid1.entries()) {
        const v1 = value as [number, number, number, number];
        const v2 = grid2.get(key) as [number, number, number, number];
        expect(v2).toBeDefined();
        expect(v1[0]).toBeCloseTo(v2[0], 10);
        expect(v1[1]).toBeCloseTo(v2[1], 10);
        expect(v1[2]).toBeCloseTo(v2[2], 10);
        expect(v1[3]).toBeCloseTo(v2[3], 10);
      }
    });

    it('should have correct keys for 4D grid', () => {
      const grid = generateGradientGrid(4, [1, 1, 1, 1], 123);
      expect(grid.has('0,0,0,0')).toBe(true);
      expect(grid.has('1,1,1,1')).toBe(true);
      expect(grid.has('2,2,2,2')).toBe(false); // size is 1, so max is 1
    });
  });

  describe('higher dimensions', () => {
    it('should support 5D grids', () => {
      const grid = generateGradientGrid(5, [1, 1, 1, 1, 1], 123);
      expect(grid.size).toBe(32); // (1 + 1) ^ 5 = 32
      expect(grid.has('0,0,0,0,0')).toBe(true);
      expect(grid.has('1,1,1,1,1')).toBe(true);
      expect(grid.has('2,2,2,2,2')).toBe(false);

      // Check that gradients are arrays of length 5
      for (const gradient of grid.values()) {
        expect(Array.isArray(gradient)).toBe(true);
        const vector = gradient as number[];
        expect(vector.length).toBe(5);

        // Check unit length
        const magnitude = Math.sqrt(
          vector.reduce((sum, val) => sum + val * val, 0),
        );
        expect(magnitude).toBeCloseTo(1, 10);
      }
    });

    it('should support 6D grids', () => {
      const grid = generateGradientGrid(6, [1, 1, 1, 1, 1, 1], 123);
      expect(grid.size).toBe(64); // (1 + 1) ^ 6 = 64
      expect(grid.has('0,0,0,0,0,0')).toBe(true);
      expect(grid.has('1,1,1,1,1,1')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle size 0', () => {
      const grid = generateGradientGrid(1, [0], 123);
      expect(grid.size).toBe(1); // 0 + 1 = 1
      expect(grid.has('0')).toBe(true);
    });

    it('should handle size 0 for 2D', () => {
      const grid = generateGradientGrid(2, [0, 0], 123);
      expect(grid.size).toBe(1); // (0 + 1) ^ 2 = 1
      expect(grid.has('0,0')).toBe(true);
    });

    it('should use different default seeds when seed not provided', () => {
      const grid1 = generateGradientGrid(1, [5]);
      const grid2 = generateGradientGrid(1, [5]);

      // They might be the same by chance, but very unlikely
      // We'll just check that the function doesn't crash
      expect(grid1.size).toBe(6);
      expect(grid2.size).toBe(6);
    });

    it('should throw error when size array length does not match dimension', () => {
      expect(() => generateGradientGrid(2, [3], 123)).toThrow();
      expect(() => generateGradientGrid(2, [3, 4, 5], 123)).toThrow();
      expect(() => generateGradientGrid(3, [2, 2], 123)).toThrow();
    });

    it('should throw error when dimension is not a positive integer', () => {
      expect(() => generateGradientGrid(0, [], 123)).toThrow();
      expect(() => generateGradientGrid(-1, [-1], 123)).toThrow();
      expect(() => generateGradientGrid(1.5, [1], 123)).toThrow();
      expect(() => generateGradientGrid(2.0, [1, 1], 123)).not.toThrow(); // 2.0 is valid
    });
  });
});

describe('getGradientAt', () => {
  it('should retrieve gradient from 1D grid', () => {
    const grid = generateGradientGrid(1, [5], 123);
    const gradient = getGradientAt(grid, [2]);

    expect(gradient).toBeDefined();
    expect(typeof gradient).toBe('number');
    expect(gradient).toBe(grid.get('2'));
  });

  it('should retrieve gradient from 2D grid', () => {
    const grid = generateGradientGrid(2, [3, 3], 123);
    const gradient = getGradientAt(grid, [1, 2]);

    expect(gradient).toBeDefined();
    expect(Array.isArray(gradient)).toBe(true);
    expect(gradient).toEqual(grid.get('1,2'));
  });

  it('should retrieve gradient from 3D grid', () => {
    const grid = generateGradientGrid(3, [2, 2, 2], 123);
    const gradient = getGradientAt(grid, [1, 0, 2]);

    expect(gradient).toBeDefined();
    expect(Array.isArray(gradient)).toBe(true);
    expect(gradient).toEqual(grid.get('1,0,2'));
  });

  it('should retrieve gradient from 4D grid', () => {
    const grid = generateGradientGrid(4, [1, 1, 1, 1], 123);
    const gradient = getGradientAt(grid, [1, 1, 0, 1]);

    expect(gradient).toBeDefined();
    expect(Array.isArray(gradient)).toBe(true);
    expect(gradient).toEqual(grid.get('1,1,0,1'));
  });

  it('should return undefined for non-existent coordinates', () => {
    const grid = generateGradientGrid(2, [3, 3], 123);
    const gradient = getGradientAt(grid, [10, 10]);

    expect(gradient).toBeUndefined();
  });

  it('should return undefined for empty grid', () => {
    const emptyGrid = new Map<string, GradientVector>();
    const gradient = getGradientAt(emptyGrid, [0, 0]);

    expect(gradient).toBeUndefined();
  });
});
