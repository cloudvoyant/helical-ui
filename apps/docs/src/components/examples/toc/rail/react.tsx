// apps/docs/src/components/examples/toc/rail/react.tsx
// Mirrors Ark UI's TOC "With Rail" example — the depth rail, bezier turns, and
// per-item SVG geometry live in the high-level component, not here.
import { Page, PageContent, PageGutter, TableOfContents } from '@cloudvoyant/helical-react';

function Filler() {
  return <div className="mt-3 min-h-96 rounded bg-muted/30" />;
}

export default function ReactTocRail() {
  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            <section className="scroll-mt-8">
              <h2 id="react-07-overview" className="text-lg font-semibold">
                Overview
              </h2>
              <Filler />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-07-installation" className="text-lg font-semibold">
                Installation
              </h2>
              <Filler />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-07-package-manager" className="text-base font-semibold">
                Package Manager
              </h3>
              <Filler />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-07-peer-dependencies" className="text-base font-semibold">
                Peer Dependencies
              </h3>
              <Filler />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-07-usage" className="text-lg font-semibold">
                Usage
              </h2>
              <Filler />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-07-server-components" className="text-base font-semibold">
                Server Components
              </h3>
              <Filler />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-07-styling" className="text-base font-semibold">
                Styling
              </h3>
              <Filler />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h4 id="react-07-theming" className="text-base font-semibold">
                Theming
              </h4>
              <Filler />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-07-api-reference" className="text-lg font-semibold">
                API Reference
              </h2>
              <Filler />
            </section>
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <TableOfContents variant="rail" headingSelector='[data-fw="react"] :is(h2, h3, h4, h5, h6)' />
        </PageGutter>
      </Page>
    </div>
  );
}
