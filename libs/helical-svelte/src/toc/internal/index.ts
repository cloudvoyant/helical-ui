// libs/helical-svelte/src/toc/internal/index.ts
// Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/index.ts).
// PRIVATE: this barrel backs the public high-level `Toc`, and must never be
// re-exported from `libs/helical-svelte/src/index.ts`. Part-prop types come from
// ./types.ts (see the note there). See ./README.md.
export type { ActiveChangeDetails as TocActiveChangeDetails, TocItem as TocItemData } from '@zag-js/toc';
export { default as TocContent } from './toc-content.svelte';
export { default as TocContext } from './toc-context.svelte';
export { default as TocIndicator } from './toc-indicator.svelte';
export { default as TocItem } from './toc-item.svelte';
export { default as TocLink } from './toc-link.svelte';
export { default as TocList } from './toc-list.svelte';
export { default as TocNav } from './toc-nav.svelte';
export { default as TocRoot } from './toc-root.svelte';
export { default as TocRootProvider } from './toc-root-provider.svelte';
export { default as TocTitle } from './toc-title.svelte';
export { tocAnatomy } from './toc.anatomy';
export { useToc, type UseTocProps, type UseTocReturn } from './use-toc.svelte';
export { useTocContext, type UseTocContext } from './use-toc-context';
export type {
  TocContentBaseProps,
  TocContentProps,
  TocContextProps,
  TocIndicatorBaseProps,
  TocIndicatorProps,
  TocItemBaseProps,
  TocItemProps,
  TocLinkBaseProps,
  TocLinkProps,
  TocListBaseProps,
  TocListProps,
  TocNavBaseProps,
  TocNavProps,
  TocRootBaseProps,
  TocRootProps,
  TocRootProviderBaseProps,
  TocRootProviderProps,
  TocTitleBaseProps,
  TocTitleProps,
} from './types';

export * as Toc from './toc';
