# Examples

Runnable examples for `@arvarus/perlin-noise`. They import the library directly
from `../src`, so no build step is required — only `npm install` at the
repository root.

| Example                              | Command                 | Description                                    |
| ------------------------------------ | ----------------------- | ---------------------------------------------- |
| [basic.ts](basic.ts)                 | `npm run example:basic` | Minimal 1D/2D/3D usage, seeding and wrapping   |
| [ascii-terrain.ts](ascii-terrain.ts) | `npm run example:ascii` | Renders a 2D noise field as ASCII art          |
| [pgm-image.ts](pgm-image.ts)         | `npm run example:image` | Writes a 256×256 grayscale image (`noise.pgm`) |

In your own project, replace the `../src` import with the package name:

```typescript
import { PerlinNoise } from '@arvarus/perlin-noise';
```
