/**
 * Generates a grayscale image (PGM format) of 2D Perlin noise
 * The PGM format is viewable in most image viewers (GIMP, IrfanView, macOS Preview...)
 * Run with: npm run example:image
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { PerlinNoise } from '../src';

const SIZE = 256;
const GRID_CELLS = 8;

const noise = new PerlinNoise({ seed: 2024, gridSize: [GRID_CELLS, GRID_CELLS] });

const pixels = Buffer.alloc(SIZE * SIZE);
for (let row = 0; row < SIZE; row++) {
  for (let col = 0; col < SIZE; col++) {
    const x = (col / SIZE) * GRID_CELLS;
    const y = (row / SIZE) * GRID_CELLS;
    const value = noise.noise([x, y]); // approximately in [-1, 1]
    const gray = Math.round(Math.min(1, Math.max(0, (value + 1) / 2)) * 255);
    pixels[row * SIZE + col] = gray;
  }
}

const header = `P5\n${SIZE} ${SIZE}\n255\n`;
const outputPath = join(__dirname, 'noise.pgm');
writeFileSync(outputPath, Buffer.concat([Buffer.from(header, 'ascii'), pixels]));

console.log(`Wrote ${SIZE}x${SIZE} noise image to ${outputPath}`);
