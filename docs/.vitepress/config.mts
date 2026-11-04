import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type DefaultTheme } from 'vitepress';

// Written by TypeDoc (`npm run docs:api`, typedoc-vitepress-theme). Missing until the reference has
// been generated, which `docs:dev`/`docs:build` always do first.
const typedocSidebarPath = fileURLToPath(
  new URL('../reference/api/typedoc-sidebar.json', import.meta.url),
);
const typedocSidebar: DefaultTheme.SidebarItem[] = existsSync(typedocSidebarPath)
  ? JSON.parse(readFileSync(typedocSidebarPath, 'utf-8'))
  : [];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'trouz',
  description: 'Procedural noise toolkit in TypeScript: Perlin noise in 1 to 10 dimensions.',
  lang: 'en-US',
  // Published on GitHub Pages at https://arvarus.github.io/trouz/.
  base: '/trouz/',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    resolve: {
      alias: {
        // The interactive demos run the library itself, straight from the sources.
        '@arvarus/trouz': fileURLToPath(new URL('../../src/index.ts', import.meta.url)),
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Playground', link: '/guide/playground' },
      { text: 'Reference', link: '/reference/api/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'How it works', link: '/guide/how-it-works' },
          { text: 'Playground', link: '/guide/playground' },
        ],
      },
      {
        text: 'Reference (generated)',
        items: [
          {
            text: 'TypeScript API',
            link: '/reference/api/',
            collapsed: true,
            items: typedocSidebar,
          },
        ],
      },
    ],
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/arvarus/trouz' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@arvarus/trouz' },
    ],
    editLink: {
      pattern: 'https://github.com/arvarus/trouz/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: { message: 'Released under the MIT License.' },
  },
});
