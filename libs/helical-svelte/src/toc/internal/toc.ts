// libs/helical-svelte/src/toc/internal/toc.ts
// Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc.ts).
// Aliases each part to Ark's namespace name (`Root`, `Nav`, …) so `Toc.Root`-style
// composition matches upstream. Part-prop types come from ./types.ts (see the note
// there); this module is private to the package.
export type { ActiveChangeDetails as TocActiveChangeDetails, TocItem as TocItemData } from '@zag-js/toc';
export { default as Content } from './toc-content.svelte';
export { default as Context } from './toc-context.svelte';
export { default as Indicator } from './toc-indicator.svelte';
export { default as Item } from './toc-item.svelte';
export { default as Link } from './toc-link.svelte';
export { default as List } from './toc-list.svelte';
export { default as Nav } from './toc-nav.svelte';
export { default as Root } from './toc-root.svelte';
export { default as RootProvider } from './toc-root-provider.svelte';
export { default as Title } from './toc-title.svelte';
export type {
  TocContentBaseProps as ContentBaseProps,
  TocContentProps as ContentProps,
  TocContextProps as ContextProps,
  TocIndicatorBaseProps as IndicatorBaseProps,
  TocIndicatorProps as IndicatorProps,
  TocItemBaseProps as ItemBaseProps,
  TocItemProps as ItemProps,
  TocLinkBaseProps as LinkBaseProps,
  TocLinkProps as LinkProps,
  TocListBaseProps as ListBaseProps,
  TocListProps as ListProps,
  TocNavBaseProps as NavBaseProps,
  TocNavProps as NavProps,
  TocRootBaseProps as RootBaseProps,
  TocRootProps as RootProps,
  TocRootProviderBaseProps as RootProviderBaseProps,
  TocRootProviderProps as RootProviderProps,
  TocTitleBaseProps as TitleBaseProps,
  TocTitleProps as TitleProps,
} from './types';
