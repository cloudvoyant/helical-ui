// libs/helical-ui/src/pagination.ts
// Closely based on: Shark UI pagination (https://shark.vini.one/docs/components/pagination, @ark-ui/react/pagination).
// Shared class strings. No framework imports.
export const paginationRootBase = 'mx-auto flex w-full justify-center gap-1';

export const paginationTriggerBase =
  'inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0';

export const paginationItemBase =
  'inline-flex h-9 min-w-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium tabular-nums text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground';

export const paginationEllipsisBase =
  'flex h-8 w-12 items-end justify-center text-muted-foreground pointer-events-none select-none [&_svg]:size-4';
