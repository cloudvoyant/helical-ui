// apps/docs/src/components/examples/page/default/react.tsx
import { Page, PageContent, PageFooter } from '@cloudvoyant/helical-react';

export default function ReactPageDefault() {
  return (
    <Page>
      <PageContent className="flex items-center justify-center">
        <div className="p-8 text-center">
          <h1 className="text-xl font-semibold">Page content</h1>
          <p className="mt-2 text-sm text-muted-foreground">The page body is at least one viewport tall.</p>
        </div>
      </PageContent>
      <PageFooter className="border-t border-border bg-muted/40">
        <p className="px-4 py-3 text-sm text-muted-foreground">Footer</p>
      </PageFooter>
    </Page>
  );
}
