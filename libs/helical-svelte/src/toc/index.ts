// libs/helical-svelte/src/toc/index.ts
// Public surface: the high-level component and the machine hook. The vendored
// Ark-compatible primitives in ./internal stay private. See ./internal/README.md.
export { default as Toc } from './Toc.svelte';
export { useToc, type TocActiveChangeDetails, type UseTocProps, type UseTocReturn } from './internal';
