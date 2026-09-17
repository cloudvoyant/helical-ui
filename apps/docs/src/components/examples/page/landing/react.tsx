// apps/docs/src/components/examples/page/landing/react.tsx
import { Page, PageSection, PageFooter } from '@cloudvoyant/helical-react';

export default function ReactPageLanding() {
  return (
    <Page variant="landing">
      <PageSection className="flex items-center justify-center bg-muted/40">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-semibold">Hero section</h1>
          <p className="mt-2 text-sm text-muted-foreground">Each section fills the viewport.</p>
        </div>
      </PageSection>
      <PageSection className="flex items-center justify-center">
        <div className="p-8 text-center">
          <h1 className="text-xl font-semibold">Features section</h1>
        </div>
      </PageSection>
      <PageFooter className="border-t border-border bg-muted/40">
        <p className="px-4 py-3 text-sm text-muted-foreground">Footer</p>
      </PageFooter>
    </Page>
  );
}
