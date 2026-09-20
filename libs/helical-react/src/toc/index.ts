// libs/helical-react/src/toc/index.ts
// Public surface: the high-level component and the machine hook. The vendored
// Ark-compatible primitives in ./internal stay private. See ./internal/README.md.
export { Toc, type TocProps, type TocVariant } from './Toc';
export { useToc, type TocActiveChangeDetails, type UseTocProps, type UseTocReturn } from './internal';
