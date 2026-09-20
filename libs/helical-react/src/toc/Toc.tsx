// libs/helical-react/src/toc/Toc.tsx
// High-level Toc. Composed only from the private Ark-compatible barrel in
// `./internal` plus stable Ark subcomponents used by the upstream TOC examples
// (@ark-ui/react/collapsible, /swap, /tree-view). The vendored primitives stay
// private so replacing them with stable `@ark-ui/react/toc` exports is a barrel
// replacement. See ./internal/README.md.
import {
  CollapsibleContent,
  CollapsibleIndicator,
  CollapsibleRoot,
  CollapsibleTrigger,
} from '@ark-ui/react/collapsible';
import { SwapIndicator, SwapRoot } from '@ark-ui/react/swap';
import { TreeView, createTreeCollection } from '@ark-ui/react/tree-view';
import {
  cn,
  tocIndicatorBase,
  tocItemBase,
  tocLinkVariants,
  tocListVariants,
  tocNavBase,
  tocSkeletonBase,
  tocTitleBase,
  type TocItem,
} from '@cloudvoyant/helical-ui';
import { ChevronRight } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Toc as TocPrimitive, useToc, useTocContext, type TocActiveChangeDetails, type UseTocReturn } from './internal';

export type TocVariant = 'default' | 'indicator' | 'hover' | 'rail' | 'tree' | 'collapsible';

export type TocProps = {
  items: TocItem[];
  variant?: TocVariant;
  /** Existing Ark-compatible machine. When supplied, Toc creates no machine. */
  value?: UseTocReturn;
  scrollEl?: () => HTMLElement | null;
  title?: ReactNode;
  activeIds?: string[];
  defaultActiveIds?: string[];
  onActiveChange?: (details: TocActiveChangeDetails) => void;
  rootMargin?: string;
  scrollBehavior?: ScrollBehavior;
  autoScroll?: boolean;
  className?: string;
};

const tocNavClass = 'flex min-w-0 flex-col gap-2';

/**
 * Hook-free dispatcher. With `value` the supplied machine is rendered directly
 * and no machine is created; without it, `TocOwned` owns exactly one machine.
 */
export function Toc(props: TocProps) {
  if (props.value) {
    return <TocView {...props} value={props.value} />;
  }
  return <TocOwned {...props} />;
}

/** The only high-level component that calls the internal `useToc`. */
function TocOwned(props: TocProps) {
  const value = useToc({
    items: props.items,
    activeIds: props.activeIds,
    defaultActiveIds: props.defaultActiveIds,
    onActiveChange: props.onActiveChange,
    rootMargin: props.rootMargin,
    scrollBehavior: props.scrollBehavior,
    autoScroll: props.autoScroll,
    scrollEl: props.scrollEl,
  });

  return <TocView {...props} value={value} />;
}

/** Renders the received machine. Never creates one. */
function TocView({
  items,
  variant = 'default',
  title = 'On this page',
  className,
  value,
}: TocProps & { value: UseTocReturn }) {
  // The machine labels the nav with `aria-labelledby` → the Title id, so a Title
  // must always render. The hover and collapsible variants carry their own visible
  // label, so theirs is screen-reader only.
  const showTitle = variant !== 'collapsible';

  return (
    <TocPrimitive.RootProvider value={value} className={cn(tocNavBase, className)}>
      {variant === 'hover' ? (
        // Ark's hover nav *is* the root nav (pointer handlers + Swap), so render it as the
        // only <nav> — nesting a second one would add a duplicate landmark.
        <HoverNav items={items} title={title} />
      ) : (
        <TocPrimitive.Nav className={tocNavClass}>
          <TocPrimitive.Title className={showTitle ? tocTitleBase : 'sr-only'}>{title}</TocPrimitive.Title>
          <TocBody items={items} variant={variant} />
        </TocPrimitive.Nav>
      )}
    </TocPrimitive.RootProvider>
  );
}

function TocBody({ items, variant }: { items: TocItem[]; variant: Exclude<TocVariant, 'hover'> }) {
  switch (variant) {
    case 'rail':
      return <RailList items={items} />;
    case 'tree':
      return <TreeNav items={items} />;
    case 'collapsible':
      return <CollapsibleNav items={items} />;
    case 'indicator':
      return <ItemList items={items} variant="indicator" />;
    default:
      return <ItemList items={items} variant="default" />;
  }
}

/** `default` and `indicator`: Ark's Title/List/Item/Link composition. */
function ItemList({ items, variant }: { items: TocItem[]; variant: 'default' | 'indicator' }) {
  return (
    <TocPrimitive.List className={tocListVariants({ variant })}>
      {variant === 'indicator' && <TocPrimitive.Indicator className={tocIndicatorBase} />}
      {items.map((item) => (
        <TocPrimitive.Item key={item.value} item={item} className={tocItemBase}>
          <TocPrimitive.Link href={`#${item.value}`} className={tocLinkVariants({ variant })}>
            {item.label}
          </TocPrimitive.Link>
        </TocPrimitive.Item>
      ))}
    </TocPrimitive.List>
  );
}

/**
 * `hover`: Ark's Swap construction. Two overlapping panels in one grid cell —
 * skeleton bars while collapsed (presence marks it `hidden`), links while
 * expanded. No pin behavior; upstream has none.
 */
function HoverNav({ items, title }: { items: TocItem[]; title?: ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <TocPrimitive.Nav
      className="absolute end-2 top-1/2 z-10 w-6 -translate-y-1/2 cursor-pointer overflow-hidden rounded-xl bg-background p-4 transition-[width,box-shadow,border-radius] duration-200 data-[expanded]:w-48 data-[expanded]:cursor-default data-[expanded]:rounded-2xl data-[expanded]:shadow-lg"
      data-expanded={hovered || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Screen-reader-only Title: the machine's `aria-labelledby` points at it. */}
      <TocPrimitive.Title className="sr-only">{title}</TocPrimitive.Title>
      <SwapRoot swap={hovered} className="grid w-full [&>*]:[grid-area:1/1]">
        <SwapIndicator
          type="off"
          className={cn(tocListVariants({ variant: 'hover' }), 'w-full items-end gap-2 px-1 py-0.5')}
        >
          {items.map((item) => (
            <TocPrimitive.Item key={item.value} item={item} className={tocSkeletonBase} />
          ))}
        </SwapIndicator>
        <SwapIndicator type="on" className={cn(tocListVariants({ variant: 'hover' }), 'w-full')}>
          {items.map((item) => (
            <TocPrimitive.Item key={item.value} item={item} className={tocItemBase}>
              <TocPrimitive.Link href={`#${item.value}`} className={tocLinkVariants({ variant: 'hover' })}>
                {item.label}
              </TocPrimitive.Link>
            </TocPrimitive.Item>
          ))}
        </SwapIndicator>
      </SwapRoot>
    </TocPrimitive.Nav>
  );
}

// Ark's rail geometry, copied verbatim from the upstream example. h2 sits at
// level 0; deeper headings step in, clamped so h5+ share h4's indent. The rail
// overlaps the row above by BRIDGE px so a turn can straddle the boundary.
const RAIL_BASE = 8;
const RAIL_STEP = 8;
const RAIL_TEXT_STEP = 12;
const RAIL_MAX_LEVEL = 2;
const RAIL_BRIDGE = 6;

const railLevel = (depth: number) => Math.min(Math.max(depth - 2, 0), RAIL_MAX_LEVEL);
const railLineOffset = (depth: number) => RAIL_BASE + railLevel(depth) * RAIL_STEP;
const railTextOffset = (depth: number) => RAIL_BASE + (railLevel(depth) + 1) * RAIL_TEXT_STEP;

function Rail({
  depth,
  prevDepth = depth,
  nextDepth = depth,
}: {
  depth: number;
  prevDepth?: number;
  nextDepth?: number;
}) {
  const line = railLineOffset(depth);
  const prevLine = railLineOffset(prevDepth);
  const nextLine = railLineOffset(nextDepth);
  const turns = prevLine !== line;

  return (
    <svg
      className="pointer-events-none absolute start-0 overflow-visible text-border group-data-[active]/link:text-primary"
      style={{
        top: -RAIL_BRIDGE,
        width: Math.max(prevLine, line) + 9,
        height: line === nextLine ? `calc(100% + ${RAIL_BRIDGE}px)` : '100%',
      }}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {turns && (
        <path d={`M ${prevLine + 0.5} 0 C ${prevLine + 0.5} 8 ${line + 0.5} 4 ${line + 0.5} ${RAIL_BRIDGE * 2}`} />
      )}
      <line x1={line + 0.5} y1={turns ? RAIL_BRIDGE * 2 : RAIL_BRIDGE} x2={line + 0.5} y2="100%" />
    </svg>
  );
}

function RailList({ items }: { items: TocItem[] }) {
  return (
    <TocPrimitive.List className={tocListVariants({ variant: 'rail' })}>
      {items.map((item, index) => (
        <TocPrimitive.Item key={item.value} item={item} className={tocItemBase}>
          <TocPrimitive.Link
            href={`#${item.value}`}
            className={tocLinkVariants({ variant: 'rail' })}
            style={{ paddingInlineStart: railTextOffset(item.depth) }}
          >
            <Rail depth={item.depth} prevDepth={items[index - 1]?.depth} nextDepth={items[index + 1]?.depth} />
            {item.label}
          </TocPrimitive.Link>
        </TocPrimitive.Item>
      ))}
    </TocPrimitive.List>
  );
}

interface TocTreeNode {
  value: string;
  label: string;
  depth: number;
  children?: TocTreeNode[];
}

/** Derives Ark's section/child hierarchy from the public flat item list by depth. */
function buildTree(items: TocItem[]): TocTreeNode[] {
  const roots: TocTreeNode[] = [];
  const stack: TocTreeNode[] = [];

  for (const item of items) {
    const node: TocTreeNode = { value: item.value, label: item.label, depth: item.depth, children: [] };
    while (stack.length > 0 && stack[stack.length - 1]!.depth >= item.depth) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    if (parent) {
      parent.children!.push(node);
    } else {
      roots.push(node);
    }
    stack.push(node);
  }

  return roots;
}

/** TreeView treats any `children` array as a branch, so leaves must drop the key. */
function pruneLeaves(nodes: TocTreeNode[]): TocTreeNode[] {
  return nodes.map((node) => {
    const children = node.children ? pruneLeaves(node.children) : [];
    if (children.length === 0) {
      return { value: node.value, label: node.label, depth: node.depth };
    }
    return { value: node.value, label: node.label, depth: node.depth, children };
  });
}

/**
 * `tree`: Ark's TreeView composition over the internal TOC context. Branches
 * auto-expand around the machine's active items; explicit toggles win.
 */
function TreeNav({ items }: { items: TocItem[] }) {
  const toc = useTocContext();
  const roots = useMemo(() => pruneLeaves(buildTree(items)), [items]);
  const collection = useMemo(
    () =>
      createTreeCollection<TocTreeNode>({
        nodeToValue: (node) => node.value,
        nodeToString: (node) => node.label,
        rootNode: { value: 'ROOT', label: '', depth: 1, children: roots },
      }),
    [roots],
  );
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const activeIds = new Set(toc.activeItems.map((item) => item.value));
  const autoExpanded = roots
    .filter((node) => activeIds.has(node.value) || (node.children ?? []).some((child) => activeIds.has(child.value)))
    .map((node) => node.value);
  const expandedValue = roots
    .map((node) => node.value)
    .filter((value) => (value in toggled ? toggled[value] : autoExpanded.includes(value)));

  return (
    <TreeView.Root
      className="w-full"
      collection={collection}
      expandedValue={expandedValue}
      onExpandedChange={({ expandedValue: next }) => {
        const nextSet = new Set(next);
        setToggled(Object.fromEntries(roots.map((node) => [node.value, nextSet.has(node.value)])));
      }}
    >
      <TreeView.Tree className="flex min-w-0 flex-col gap-0.5">
        {roots.map((node, index) => (
          <TocTreeBranch key={node.value} node={node} indexPath={[index]} />
        ))}
      </TreeView.Tree>
    </TreeView.Root>
  );
}

function TocTreeBranch({ node, indexPath }: TreeView.NodeProviderProps<TocTreeNode>) {
  const toc = useTocContext();
  const linkProps = toc.getLinkProps({ item: { value: node.value, depth: node.depth } });

  return (
    <TreeView.NodeProvider node={node} indexPath={indexPath}>
      {node.children ? (
        <TreeView.Branch className="flex min-w-0 flex-col">
          <TreeView.BranchControl className="flex min-w-0 items-center gap-0.5">
            <TreeView.BranchIndicator className="size-3.5 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-90">
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </TreeView.BranchIndicator>
            <TreeView.BranchText className="min-w-0 flex-1">
              <a {...linkProps} className={cn(tocLinkVariants({ variant: 'tree' }), 'flex-1')}>
                {node.label}
              </a>
            </TreeView.BranchText>
          </TreeView.BranchControl>
          <TreeView.BranchContent className="relative ms-1.5 flex min-w-0 flex-col gap-0.5 ps-3">
            <TreeView.BranchIndentGuide className="absolute inset-y-0 start-1 w-px bg-border" />
            {node.children.map((child, index) => (
              <TocTreeBranch key={child.value} node={child} indexPath={[...indexPath, index]} />
            ))}
          </TreeView.BranchContent>
        </TreeView.Branch>
      ) : (
        <TreeView.Item className="min-w-0">
          <TreeView.ItemText className="min-w-0">
            <a {...linkProps} className={tocLinkVariants({ variant: 'tree' })}>
              {node.label}
            </a>
          </TreeView.ItemText>
        </TreeView.Item>
      )}
    </TreeView.NodeProvider>
  );
}

/**
 * `collapsible`: Ark's Collapsible + progress-ring construction, with numbered
 * links and the active label in the trigger.
 */
function CollapsibleNav({ items }: { items: TocItem[] }) {
  return (
    <CollapsibleRoot className="flex w-full flex-col gap-2">
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-transparent px-3 py-2.5 text-start text-sm font-medium text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <TocPrimitive.Context>
          {({ activeItems }) => {
            const activeIndex = items.findIndex((item) => item.value === activeItems[0]?.value);
            const activeLabel = items[activeIndex]?.label ?? 'On this page';
            return (
              <span className="flex min-w-0 items-center gap-2">
                <ProgressRing index={activeIndex} total={items.length} />
                <span className="truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {activeLabel}
                </span>
              </span>
            );
          }}
        </TocPrimitive.Context>
        <CollapsibleIndicator className="size-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-90">
          <ChevronRight className="size-4" aria-hidden="true" />
        </CollapsibleIndicator>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden pt-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
        <TocPrimitive.List className={tocListVariants({ variant: 'collapsible' })}>
          {items.map((item, index) => (
            <TocPrimitive.Item key={item.value} item={item} className={tocItemBase}>
              <TocPrimitive.Link
                href={`#${item.value}`}
                className={cn(tocLinkVariants({ variant: 'collapsible' }), 'gap-2')}
              >
                <span className="text-xs tabular-nums opacity-60">{String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </TocPrimitive.Link>
            </TocPrimitive.Item>
          ))}
        </TocPrimitive.List>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}

function ProgressRing({ index, total }: { index: number; total: number }) {
  const progress = index >= 0 ? (index + 1) / total : 0;

  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className="size-6 shrink-0">
      <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <circle
        cx="18"
        cy="18"
        r="14"
        fill="none"
        pathLength="100"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeDasharray={`${progress * 100} 100`}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
        style={{ transition: 'stroke-dasharray 0.4s ease-out' }}
      />
      <text
        x="18"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="600"
        fill="currentColor"
      >
        {index >= 0 ? index + 1 : '—'}
      </text>
    </svg>
  );
}
