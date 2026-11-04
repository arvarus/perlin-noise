# Playground

Every parameter of `PerlinNoise` and `fbm2D`, live. The images below are computed in your browser by the library itself, straight from the sources of this repository.

## 2D noise

<NoiseExplorer />

Things to try:

- **Single octave**: the smooth, blobby base layer. Zoom in and out to change how many grid cells span the picture.
- **fBm with one octave** is the same as single octave. Add octaves and watch detail accumulate.
- **Persistence** near `1` makes every octave count equally, giving a rough, noisy look. Near `0.1`, higher octaves barely register.
- **Seed**: a different seed gives a completely different landscape, always the same for a given number.

## 1D noise

<NoiseCurve />
