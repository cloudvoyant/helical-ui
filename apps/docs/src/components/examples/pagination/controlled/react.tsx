// apps/docs/src/components/examples/pagination/controlled/react.tsx
import { useState } from 'react';
import { Pagination, VStack, PaginationItems, PaginationPrevious, PaginationNext } from '@cloudvoyant/helical-react';

export default function ReactPaginationControlled() {
  const [page, setPage] = useState(2);
  return (
    <VStack className="items-center gap-2">
      <Pagination count={120} page={page} onPageChange={({ page }) => setPage(page)}>
        <PaginationPrevious />
        <PaginationItems />
        <PaginationNext />
      </Pagination>
      <p className="text-sm text-muted-foreground">Page {page} of 12</p>
    </VStack>
  );
}
