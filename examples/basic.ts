/**
 * Basic usage of @arvarus/perlin-noise
 * Run with: npm run example:basic
 */

import { PerlinNoise } from '../src';

// Same seed always produces the same noise pattern
const noise1D = new PerlinNoise({ seed: 42, gridSize: [16] });
const noise2D = new PerlinNoise({ seed: 42, gridSize: [16, 16] });
const noise3D = new PerlinNoise({ seed: 42, gridSize: [16, 16, 16] });

console.log('1D noise along a line:');
for (let x = 0; x <= 2; x += 0.25) {
  console.log(`  noise([${x.toFixed(2)}]) = ${noise1D.noise([x]).toFixed(4)}`);
}

console.log('\n2D noise:');
console.log(`  noise([1.5, 2.3])  = ${noise2D.noise([1.5, 2.3]).toFixed(4)}`);
console.log(`  noise([1.6, 2.3])  = ${noise2D.noise([1.6, 2.3]).toFixed(4)}`);

console.log('\n3D noise:');
console.log(`  noise([1.5, 2.3, 0.7]) = ${noise3D.noise([1.5, 2.3, 0.7]).toFixed(4)}`);

console.log('\nCoordinates wrap around the grid (repeating pattern):');
console.log(`  noise([1.5])  = ${noise1D.noise([1.5]).toFixed(4)}`);
console.log(
  `  noise([17.5]) = ${noise1D.noise([17.5]).toFixed(4)} (same value, 17.5 wraps to 1.5)`,
);
