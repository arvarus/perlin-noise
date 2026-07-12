/**
 * Renders 2D Perlin noise as ASCII art in the terminal
 * Run with: npm run example:ascii
 */

import { PerlinNoise } from '../src';

const WIDTH = 78;
const HEIGHT = 36;
// Characters from "low" to "high" terrain
const PALETTE = ' .:-=+*#%@';

const noise = new PerlinNoise({ seed: 1337, gridSize: [8, 8] });

const lines: string[] = [];
for (let row = 0; row < HEIGHT; row++) {
  let line = '';
  for (let col = 0; col < WIDTH; col++) {
    // Map the screen to a few grid cells so features stay visible
    const x = (col / WIDTH) * 8;
    const y = (row / HEIGHT) * 8;
    const value = noise.noise([x, y]); // approximately in [-1, 1]
    const normalized = Math.min(1, Math.max(0, (value + 1) / 2));
    const index = Math.min(PALETTE.length - 1, Math.floor(normalized * PALETTE.length));
    line += PALETTE[index];
  }
  lines.push(line);
}

console.log(lines.join('\n'));
