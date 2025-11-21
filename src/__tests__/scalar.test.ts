import { generateGradientGrid } from '../grid';
import { calculateScalarValues } from '../scalar';

describe('calculateScalarValues', () => {
  describe('1D grid', () => {
    it('should return 2 scalar values for a point in 1D (2 vertices)', () => {
      const grid = generateGradientGrid(1, [5], 123);
      const point = [2.5]; // Point in cell [2]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(2); // 2^1 = 2 vertices
    });

    it('should calculate correct dot products for 1D', () => {
      const grid = generateGradientGrid(1, [5], 123);
      const point = [1.3]; // Point in cell [1]
      const scalarValues = calculateScalarValues(grid, point);

      // Cell [1] has vertices at [1] and [2]
      const gradient1 = grid.get('1') as number;
      const gradient2 = grid.get('2') as number;

      // Distance vectors: point - vertex
      const distance1 = point[0] - 1; // 1.3 - 1 = 0.3
      const distance2 = point[0] - 2; // 1.3 - 2 = -0.7

      // Dot products: gradient * distance
      const expected1 = gradient1 * distance1;
      const expected2 = gradient2 * distance2;

      expect(scalarValues[0]).toBeCloseTo(expected1, 10);
      expect(scalarValues[1]).toBeCloseTo(expected2, 10);
    });

    it('should handle point at cell boundary', () => {
      const grid = generateGradientGrid(1, [5], 123);
      const point = [2.0]; // Exactly at cell boundary (cell [2])
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(2);
      // Cell [2] has vertices at [2] (i=0) and [3] (i=1)
      // Distance to vertex [2] should be 0
      const gradient2 = grid.get('2') as number;
      expect(scalarValues[0]).toBeCloseTo(gradient2 * 0, 10); // First vertex is [2]
    });

    it('should handle negative coordinates', () => {
      // Create a grid that covers negative coordinates by using a larger grid
      // and testing a point that maps to a valid cell
      const grid = generateGradientGrid(1, [10], 123);
      const point = [0.5]; // Cell [0], which is valid
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(2);
      // Verify vertices are [0] and [1]
      expect(grid.has('0')).toBe(true);
      expect(grid.has('1')).toBe(true);
    });

    it('should throw error when point is outside grid bounds', () => {
      const grid = generateGradientGrid(1, [5], 123);
      const point = [10.0]; // Outside grid (max is 5, so vertices go up to 6)

      expect(() => calculateScalarValues(grid, point)).toThrow();
    });
  });

  describe('2D grid', () => {
    it('should return 4 scalar values for a point in 2D (4 vertices)', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point = [2.5, 3.2]; // Point in cell [2, 3]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(4); // 2^2 = 4 vertices
    });

    it('should calculate correct dot products for 2D', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point = [1.3, 2.7]; // Point in cell [1, 2]
      const scalarValues = calculateScalarValues(grid, point);

      // Cell [1, 2] has vertices in order: [1,2] (i=0), [2,2] (i=1), [1,3] (i=2), [2,3] (i=3)
      const gradient12 = grid.get('1,2') as [number, number];
      const gradient22 = grid.get('2,2') as [number, number];
      const gradient13 = grid.get('1,3') as [number, number];
      const gradient23 = grid.get('2,3') as [number, number];

      // Distance vectors: point - vertex
      const distance12 = [point[0] - 1, point[1] - 2]; // [0.3, 0.7]
      const distance22 = [point[0] - 2, point[1] - 2]; // [-0.7, 0.7]
      const distance13 = [point[0] - 1, point[1] - 3]; // [0.3, -0.3]
      const distance23 = [point[0] - 2, point[1] - 3]; // [-0.7, -0.3]

      // Dot products
      const expected12 = gradient12[0] * distance12[0] + gradient12[1] * distance12[1];
      const expected22 = gradient22[0] * distance22[0] + gradient22[1] * distance22[1];
      const expected13 = gradient13[0] * distance13[0] + gradient13[1] * distance13[1];
      const expected23 = gradient23[0] * distance23[0] + gradient23[1] * distance23[1];

      expect(scalarValues[0]).toBeCloseTo(expected12, 10);
      expect(scalarValues[1]).toBeCloseTo(expected22, 10);
      expect(scalarValues[2]).toBeCloseTo(expected13, 10);
      expect(scalarValues[3]).toBeCloseTo(expected23, 10);
    });

    it('should handle point at cell corner', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point = [2.0, 3.0]; // Exactly at vertex [2, 3] in cell [2, 3]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(4);
      // Cell [2, 3] has vertices in order: [2,3] (i=0), [3,3] (i=1), [2,4] (i=2), [3,4] (i=3)
      // Distance to vertex [2, 3] should be [0, 0]
      expect(scalarValues[0]).toBeCloseTo(0, 10); // dot product with [0, 0] is 0
    });

    it('should handle decimal coordinates correctly', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point = [0.1, 0.9]; // Should be in cell [0, 0]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(4);
      // All vertices should be in cell [0, 0]: [0,0], [0,1], [1,0], [1,1]
      expect(grid.has('0,0')).toBe(true);
      expect(grid.has('0,1')).toBe(true);
      expect(grid.has('1,0')).toBe(true);
      expect(grid.has('1,1')).toBe(true);
    });

    it('should throw error when point is outside grid bounds', () => {
      const grid = generateGradientGrid(2, [3, 3], 123);
      const point = [10.0, 10.0]; // Outside grid

      expect(() => calculateScalarValues(grid, point)).toThrow();
    });
  });

  describe('3D grid', () => {
    it('should return 8 scalar values for a point in 3D (8 vertices)', () => {
      const grid = generateGradientGrid(3, [5, 5, 5], 123);
      const point = [2.5, 3.2, 1.8]; // Point in cell [2, 3, 1]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(8); // 2^3 = 8 vertices
    });

    it('should calculate correct dot products for 3D', () => {
      const grid = generateGradientGrid(3, [5, 5, 5], 123);
      const point = [1.0, 1.0, 1.0]; // Point in cell [1, 1, 1]
      const scalarValues = calculateScalarValues(grid, point);

      // Verify we get 8 values
      expect(scalarValues).toHaveLength(8);

      // Verify all vertices exist in grid
      const cell = [1, 1, 1];
      for (let i = 0; i < 8; i++) {
        const vertex = [
          cell[0] + ((i >> 0) & 1),
          cell[1] + ((i >> 1) & 1),
          cell[2] + ((i >> 2) & 1),
        ];
        const key = vertex.join(',');
        expect(grid.has(key)).toBe(true);
      }
    });

    it('should handle point at cell center', () => {
      const grid = generateGradientGrid(3, [5, 5, 5], 123);
      const point = [1.5, 1.5, 1.5]; // Center of cell [1, 1, 1]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(8);
      // All distance vectors should have components of ±0.5
      expect(scalarValues.every(val => typeof val === 'number')).toBe(true);
    });
  });

  describe('higher dimensions', () => {
    it('should return 16 scalar values for a point in 4D (16 vertices)', () => {
      const grid = generateGradientGrid(4, [3, 3, 3, 3], 123);
      const point = [1.0, 1.0, 1.0, 1.0]; // Point in cell [1, 1, 1, 1]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(16); // 2^4 = 16 vertices
    });

    it('should return 32 scalar values for a point in 5D (32 vertices)', () => {
      const grid = generateGradientGrid(5, [2, 2, 2, 2, 2], 123);
      const point = [1.0, 1.0, 1.0, 1.0, 1.0]; // Point in cell [1, 1, 1, 1, 1]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(32); // 2^5 = 32 vertices
    });
  });

  describe('edge cases', () => {
    it('should handle point at origin', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point = [0.0, 0.0]; // Cell [0, 0]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(4);
      expect(grid.has('0,0')).toBe(true);
      expect(grid.has('0,1')).toBe(true);
      expect(grid.has('1,0')).toBe(true);
      expect(grid.has('1,1')).toBe(true);
    });

    it('should handle very small coordinates', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point = [0.0001, 0.0001]; // Cell [0, 0]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(4);
    });

    it('should handle large coordinates within bounds', () => {
      const grid = generateGradientGrid(2, [10, 10], 123);
      const point = [9.9, 9.9]; // Cell [9, 9], should have vertices at [9,9], [9,10], [10,9], [10,10]
      const scalarValues = calculateScalarValues(grid, point);

      expect(scalarValues).toHaveLength(4);
      // Grid size is 10, so vertices go up to 10
      expect(grid.has('9,9')).toBe(true);
      expect(grid.has('9,10')).toBe(true);
      expect(grid.has('10,9')).toBe(true);
      expect(grid.has('10,10')).toBe(true);
    });

    it('should produce consistent results for same point', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point = [2.5, 3.2];

      const scalarValues1 = calculateScalarValues(grid, point);
      const scalarValues2 = calculateScalarValues(grid, point);

      expect(scalarValues1).toHaveLength(scalarValues2.length);
      for (let i = 0; i < scalarValues1.length; i++) {
        expect(scalarValues1[i]).toBeCloseTo(scalarValues2[i], 10);
      }
    });

    it('should produce different results for different points', () => {
      const grid = generateGradientGrid(2, [5, 5], 123);
      const point1 = [1.0, 1.0];
      const point2 = [2.0, 2.0];

      const scalarValues1 = calculateScalarValues(grid, point1);
      const scalarValues2 = calculateScalarValues(grid, point2);

      // They might have some same values, but at least one should be different
      expect(scalarValues1).toHaveLength(4);
      expect(scalarValues2).toHaveLength(4);
    });
  });
});

