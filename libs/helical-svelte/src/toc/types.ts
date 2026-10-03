import type { TocItem } from '@cloudvoyant/helical-ui';
import type { Snippet } from 'svelte';
import type { TocActiveChangeDetails, UseTocReturn } from './internal';

export type TocVariant = 'default' | 'indicator' | 'hover' | 'rail' | 'tree' | 'collapsible';

export type TableOfContentsProps = {
  /** Explicit items override automatic heading collection. */
  items?: TocItem[];
  /** CSS selector used when collecting headings automatically. */
  headingSelector?: string;
  variant?: TocVariant;
  /** Existing Ark-compatible machine accessor. When supplied, TableOfContents creates none. */
  value?: UseTocReturn;
  scrollEl?: () => HTMLElement | null;
  title?: string | Snippet;
  activeIds?: string[];
  defaultActiveIds?: string[];
  onActiveChange?: (details: TocActiveChangeDetails) => void;
  rootMargin?: string;
  scrollBehavior?: ScrollBehavior;
  autoScroll?: boolean;
  class?: string;
};

/** Internal compatibility alias used by the split owner/view components. */
export type TocProps = TableOfContentsProps;
