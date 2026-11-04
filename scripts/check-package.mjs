// Smoke test of the built package: loads it the way a consumer would, once as CommonJS and
// once as an ES module, through the package name so that "exports" is exercised.
import { execFileSync } from 'node:child_process';

const script = (load) => `
  ${load}
  const noise = new PerlinNoise({ seed: 42, gridSize: [8, 8] });
  const value = noise.noise2D(1.5, 2.5);
  if (typeof PerlinNoise !== 'function' || !(Math.abs(value) <= 1)) process.exit(1);
`;

const run = (args) => execFileSync(process.execPath, args, { stdio: 'inherit' });

run(['-e', script("const { PerlinNoise } = require('@arvarus/trouz');")]);
run(['--input-type=module', '-e', script("import { PerlinNoise } from '@arvarus/trouz';")]);
console.log('package check: CJS and ESM entry points OK');
