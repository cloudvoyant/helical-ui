import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/command/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['@tanstack/charts'],
  noExternal: ['@cloudvoyant/utils'],
});
