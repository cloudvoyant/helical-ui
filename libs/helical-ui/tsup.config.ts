import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/command/index.ts',
    'src/editor/index.ts',
    'src/chart.ts',
    'src/mermaid.ts',
    'src/code-block.ts',
    'src/latex.ts',
    'src/manim.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [/^@tanstack\/charts(?:\/.*)?$/, /^shiki(?:\/.*)?$/, 'mermaid', 'katex', 'lowlight', 'manim-web'],
  noExternal: ['@cloudvoyant/utils'],
});
