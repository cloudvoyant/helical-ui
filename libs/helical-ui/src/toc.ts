// No direct upstream npm source: Ark has not shipped @ark-ui/*/toc to the
// registry, so each framework package vendors Ark's unpublished Toc primitives
// behind a private compatibility barrel. See the .codevoyant/spec/toc research.
// This file holds only shared class strings / cva / types; no
// framework or @zag-js imports.
import { cva } from 'class-variance-authority';

export interface TocItem {
  /** The id of the heading element in the document (matched by `href="#value"`). */
  value: string;
  /** Heading level (2 = h2, 3 = h3, …); drives indentation. */
  depth: number;
  /** The visible label rendered in the TOC link. */
  label: string;
}

export const tocNavBase = 'relative w-full min-w-0 text-sm';

export const tocTitleBase =
  'mb-2 px-2 text-[0.6875rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase';

export const tocListBase = 'relative m-0 flex min-w-0 list-none flex-col p-0';

export const tocListVariants = cva(tocListBase, {
  variants: {
    variant: {
      default: 'gap-0.5',
      indicator: 'gap-0.5',
      hover: 'gap-0.5',
      rail: 'gap-0',
      tree: 'gap-0.5',
      collapsible: 'gap-0.5',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const tocItemBase = 'min-w-0';

// Depth indent uses the machine's `--depth` CSS var (set on each item by
// getItemProps; a unitless heading level, e.g. 2, 3). h2 (depth 2) sits flush;
// each deeper level steps in by one spacing unit.
export const tocLinkBase =
  'flex items-center gap-1.5 truncate rounded-md py-[0.3rem] pe-2 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[current]:font-medium data-[current]:text-primary motion-reduce:transition-none';

export const tocLinkVariants = cva(tocLinkBase, {
  variants: {
    variant: {
      default: 'ps-[calc(--spacing(3.5)+(var(--depth,2)-2)*--spacing(4))]',
      indicator: 'ps-[calc(--spacing(3.5)+(var(--depth,2)-2)*--spacing(4))]',
      hover: 'px-1 py-[0.2rem] text-[0.8125rem] data-[current]:bg-primary/10',
      rail: 'group/link relative rounded-none py-[0.35rem] text-[0.8125rem] leading-[1.4]',
      tree: 'rounded-none ps-1.5',
      collapsible: 'ps-2',
    },
  },
  defaultVariants: { variant: 'default' },
});

// Sliding marker for the `indicator` variant. Reads --top/--height from the nav
// root (getRootProps sets them from the active item's rect); getIndicatorProps
// adds position:absolute and `hidden` when there is no active item.
export const tocIndicatorBase =
  'pointer-events-none absolute start-0 [top:var(--top)] h-[1.85rem] w-0.5 rounded-full bg-primary transition-[top] duration-200 ease-out motion-reduce:transition-none';

// Collapsed skeleton bar for the `hover` variant (shown before expansion).
export const tocSkeletonBase = 'block h-0.5 w-[calc(var(--depth)*12px)] rounded-full bg-muted-foreground opacity-30';
