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

export const tocNavBase = 'w-full min-w-0 text-sm';

export const tocTitleBase = 'mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase';

export const tocListBase = 'relative flex min-w-0 flex-col';

export const tocListVariants = cva(tocListBase, {
  variants: {
    variant: {
      default: 'gap-0.5 border-s border-border',
      indicator: 'gap-0.5 border-s border-border',
      hover: 'gap-0.5',
      rail: 'gap-0.5',
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
  'flex items-center gap-1.5 truncate rounded-md py-1 pe-2 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-[active]:text-foreground motion-reduce:transition-none';

export const tocLinkVariants = cva(tocLinkBase, {
  variants: {
    variant: {
      // -1px + border pulls the active marker over the list's own start border
      default:
        '-ms-px border-s-2 border-transparent ps-[calc(--spacing(3)+(var(--depth,2)-2)*--spacing(3))] data-[active]:border-primary',
      indicator: 'ps-[calc(--spacing(3)+(var(--depth,2)-2)*--spacing(3))]',
      hover: 'ps-2',
      rail: 'group/link relative ps-2',
      tree: 'ps-1.5',
      collapsible: 'ps-2',
    },
  },
  defaultVariants: { variant: 'default' },
});

// Sliding marker for the `indicator` variant. Reads --top/--height from the nav
// root (getRootProps sets them from the active item's rect); getIndicatorProps
// adds position:absolute and `hidden` when there is no active item.
export const tocIndicatorBase =
  'pointer-events-none absolute start-0 h-(--height) w-0.5 translate-y-(--top) rounded-full bg-primary transition-[translate,height] duration-200 ease-out motion-reduce:transition-none';

// Collapsed skeleton bar for the `hover` variant (shown before expansion).
export const tocSkeletonBase = 'h-1.5 rounded-full bg-border transition-colors';
