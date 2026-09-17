// apps/docs/astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cloudvoyant.github.io',
  base: '/helical-ui/',
  integrations: [react(), svelte(), mdx()],
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        // Serve workspace packages from source in dev so edits to libs/* hot-reload
        // instead of requiring a rebuild (the package exports map points at dist/).
        // Exact-match anchors keep subpath imports (@cloudvoyant/helical-ui/theme.css, ...)
        // resolving through the exports map, not through the JS alias.
        {
          find: /^@cloudvoyant\/helical-ui$/,
          replacement: new URL('../../libs/helical-ui/src/index.ts', import.meta.url).pathname,
        },
        {
          find: /^@cloudvoyant\/helical-react$/,
          replacement: new URL('../../libs/helical-react/src/index.ts', import.meta.url).pathname,
        },
        {
          find: /^@cloudvoyant\/helical-svelte$/,
          replacement: new URL('../../libs/helical-svelte/src/index.ts', import.meta.url).pathname,
        },
      ],
    },
    optimizeDeps: {
      // Workspace packages resolve to source in dev (see alias above); don't let
      // Vite pre-bundle and cache a stale copy (new named exports then throw
      // "does not provide an export named ..." until a dev-server restart).
      exclude: ['@cloudvoyant/helical-ui', '@cloudvoyant/helical-react', '@cloudvoyant/helical-svelte'],
    },
  },
  redirects: {
    '/docs': '/general/introduction',
    '/docs/general/introduction': '/general/introduction',
    '/docs/general/installation': '/general/installation',
    '/docs/general/theming': '/general/theming',
    '/docs/components/button': '/components/button',
    '/docs/components/toggle-button': '/components/toggle-button',
    '/docs/components/badge': '/components/badge',
    '/docs/components/container': '/components/layout',
    '/docs/components/row': '/components/layout',
    '/docs/components/col': '/components/layout',
    '/docs/components/layout': '/components/layout',
    '/docs/components/stack': '/components/stack',
    '/docs/components/scroll': '/components/scroll',
    '/docs/components/splitter': '/components/splitter',
    '/docs/components/nav-menu': '/components/navbar',
    '/docs/components/tabs': '/components/tabs',
    '/docs/components/pagination': '/components/pagination',
    '/docs/components/navbar': '/components/navbar',
    '/docs/components/mermaid': '/components/mermaid',
    '/docs/components/notice': '/components/notice',
    '/docs/components/figure': '/components/figure',
    '/docs/components/hint': '/components/reveal',
    '/docs/components/reveal': '/components/reveal',
    '/docs/components/math': '/components/latex',
    '/docs/components/latex': '/components/latex',
    '/docs/components/code-block': '/components/code-block',
    '/docs/components/manim': '/components/manim',
    '/docs/components/youtube': '/components/youtube',
    '/docs/components/chart': '/components/chart',
    '/docs/components/questions': '/components/questions',
    '/docs/components/assessment': '/components/quiz',
    '/docs/components/quiz': '/components/quiz',
    '/docs/components/prev-next': '/components/prev-next',
  },
});
