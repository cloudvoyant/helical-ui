// apps/docs/src/components/examples/page/footer/react.tsx
import { Page, PageContent, PageFooter, Container } from '@cloudvoyant/helical-react';

export default function ReactPageFooter() {
  return (
    <Page>
      <PageContent className="flex items-center justify-center">
        <div className="p-8 text-center">
          <h1 className="text-xl font-semibold">Page content</h1>
          <p className="mt-2 text-sm text-muted-foreground">The footer sits below the page body.</p>
        </div>
      </PageContent>
      <PageFooter className="border-t border-border bg-muted/40">
        <Container className="grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
          <div>
            <p className="text-sm font-semibold">Product</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Overview</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Company</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>About</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Resources</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Docs</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Legal</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </Container>
        <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">© 2026 helical-ui</p>
      </PageFooter>
    </Page>
  );
}
