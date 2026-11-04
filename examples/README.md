# Examples

Runnable examples for `@arvarus/trouz`. They import the library by its package
name, exactly as a consumer would, so each command builds the package first
(`npm run build`). Only `npm install` at the repository root is required.

| Example                              | Command                 | Description                                    |
| ------------------------------------ | ----------------------- | ---------------------------------------------- |
| [basic.ts](basic.ts)                 | `npm run example:basic` | Minimal 1D/2D/3D usage, seeding and wrapping   |
| [ascii-terrain.ts](ascii-terrain.ts) | `npm run example:ascii` | Renders a 2D noise field as ASCII art          |
| [pgm-image.ts](pgm-image.ts)         | `npm run example:image` | Writes a 256×256 grayscale image (`noise.pgm`) |
