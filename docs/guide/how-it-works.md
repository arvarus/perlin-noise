# How it works

trouz implements classic Perlin noise, generalized to any number of dimensions.

## The algorithm

1. **A grid of gradients.** At construction, every node of the grid (`gridSize`) receives a random unit vector, drawn from a seeded pseudo-random generator. This is why a given seed always yields the same noise.
2. **Dot products.** To compute the noise at a point, the library finds the cell containing it, which has 2<sup>n</sup> corners in n dimensions. For each corner, it takes the dot product between the corner's gradient and the vector from that corner to the point.
3. **Smooth interpolation.** The 2<sup>n</sup> values are blended with a smoothstep curve, `t² (3 − 2t)`, whose slope is zero at both ends. This is what removes visible grid lines.

A consequence of this design: the noise is exactly `0` at integer coordinates, and its slope at each node follows the node's gradient.

## Wrapping

Coordinates are wrapped with a modulo on `gridSize` before the lookup, so the field repeats every `gridSize[i]` units along dimension `i`. That makes tileable textures free, and also means a larger grid does not make the field "bigger", only less repetitive.

## fBm

Fractional Brownian motion sums octaves of the same noise:

```
fbm(p) = Σ amplitude_k · noise(p · lacunarity^k) / Σ amplitude_k
amplitude_k = persistence^k
```

Dividing by the total amplitude keeps the result in the same range as a single octave.

## A 1D example

In one dimension the whole mechanism is visible: values are zero on whole numbers, and smooth in between. Add octaves to see detail build up.

<NoiseCurve />
