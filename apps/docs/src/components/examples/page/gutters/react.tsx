// apps/docs/src/components/examples/page/gutters/react.tsx
import { Page, PageGutter, PageContent, PageFooter, Col } from '@cloudvoyant/helical-react';

export default function ReactPageGutters() {
  return (
    <Page>
      <PageGutter side="left">
        <Col className="w-full gap-2 border-r border-border bg-muted/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground">Left gutter</p>
          <p className="text-sm">Sticky, non-scrolling.</p>
        </Col>
      </PageGutter>
      <PageContent className="flex items-center justify-center">
        <div className="p-8 text-center">
          <h1 className="text-xl font-semibold">Center content</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Scroll down — the gutters stay fixed until the footer appears.
          </p>
          <div className="mx-auto mt-8 max-w-md space-y-4 text-left text-sm text-muted-foreground">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i}>
                Paragraph {i + 1} — enough content to make the page body taller than the viewport, so the sticky gutters
                stay pinned while the center column scrolls.
              </p>
            ))}
          </div>
        </div>
      </PageContent>
      <PageGutter side="right" align="center">
        <Col className="w-full gap-2 border-l border-border bg-muted/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground">Right gutter</p>
          <p className="text-sm">Aligned center.</p>
        </Col>
      </PageGutter>
      <PageFooter className="border-t border-border bg-muted/40">
        <p className="px-4 py-3 text-sm text-muted-foreground">Footer</p>
      </PageFooter>
    </Page>
  );
}
