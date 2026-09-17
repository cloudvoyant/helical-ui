// libs/helical-ui/src/prevnext.ts
// Closely based on: diffbook PrevNext (packages/diffbook-ui/src/components/PrevNext.tsx).

export const prevNextRootBase =
  'not-prose mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between';

export const prevNextLinkBase =
  'group flex min-w-0 flex-1 flex-col rounded-lg border border-border px-4 py-3 no-underline transition-colors hover:border-primary';

export const prevNextLinkNextBase = 'items-end text-right';

export const prevNextDirectionBase = 'text-xs font-medium text-muted-foreground';

export const prevNextTitleBase =
  'truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary';

export const prevNextSpacerBase = 'flex-1';

export interface PrevNextProps {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
  className?: string;
}
