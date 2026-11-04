import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import NoiseCurve from './NoiseCurve.vue';
import NoiseExplorer from './NoiseExplorer.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('NoiseCurve', NoiseCurve);
    app.component('NoiseExplorer', NoiseExplorer);
  },
} satisfies Theme;
