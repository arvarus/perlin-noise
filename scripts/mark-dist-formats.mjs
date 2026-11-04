// Tells Node how to read each build output: `.js` files in dist/esm are ES modules and
// those in dist/cjs are CommonJS, whatever the "type" of the root package.json.
import { writeFileSync } from 'node:fs';

writeFileSync('dist/esm/package.json', '{ "type": "module" }\n');
writeFileSync('dist/cjs/package.json', '{ "type": "commonjs" }\n');
