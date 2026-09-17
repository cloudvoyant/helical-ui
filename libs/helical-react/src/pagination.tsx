// libs/helical-react/src/pagination.tsx
// Closely based on: Shark UI pagination (https://shark.vini.one/docs/components/pagination, @ark-ui/react/pagination)
import type * as React from 'react';
import {
  PaginationRoot as ArkPaginationRoot,
  PaginationContext as ArkPaginationContext,
  PaginationItem as ArkPaginationItem,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationEllipsis as ArkPaginationEllipsis,
  type PaginationRootProps,
} from '@ark-ui/react/pagination';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import {
  paginationRootBase,
  paginationTriggerBase,
  paginationItemBase,
  paginationEllipsisBase,
  cn,
} from '@cloudvoyant/helical-ui';

export function Pagination({ className, ...props }: PaginationRootProps) {
  return <ArkPaginationRoot className={cn(paginationRootBase, className)} {...props} />;
}

export function PaginationPrevious(props: HTMLArkProps<'button'>) {
  return (
    <PaginationPrevTrigger asChild {...props}>
      <ark.button className={cn(paginationTriggerBase)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Previous
      </ark.button>
    </PaginationPrevTrigger>
  );
}

export function PaginationNext(props: HTMLArkProps<'button'>) {
  return (
    <PaginationNextTrigger asChild {...props}>
      <ark.button className={cn(paginationTriggerBase)}>
        Next
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </ark.button>
    </PaginationNextTrigger>
  );
}

export type PaginationItemProps = React.ComponentProps<typeof ArkPaginationItem> & { className?: string };

export function PaginationItem({ className, children, ...rest }: PaginationItemProps) {
  return (
    <ArkPaginationItem asChild {...rest}>
      <ark.button className={cn(paginationItemBase, className)}>{children}</ark.button>
    </ArkPaginationItem>
  );
}

export function PaginationItems() {
  return (
    <ArkPaginationContext>
      {({ pages }) =>
        pages.map((page, index) =>
          page.type === 'page' ? (
            <PaginationItem key={page.value} type="page" value={page.value}>
              {page.value}
            </PaginationItem>
          ) : (
            <PaginationEllipsis key={`ellipsis-${index}`} index={index} />
          ),
        )
      }
    </ArkPaginationContext>
  );
}

export function PaginationEllipsis({ className, ...rest }: React.ComponentProps<typeof ArkPaginationEllipsis>) {
  return (
    <ArkPaginationEllipsis className={cn(paginationEllipsisBase, className)} {...rest}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    </ArkPaginationEllipsis>
  );
}

export { ArkPaginationRoot as PaginationRoot, ArkPaginationContext as PaginationContext };
export type { PaginationRootProps };
