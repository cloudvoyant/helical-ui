// apps/docs/src/components/examples/toc/collapsible/react.tsx
// Mirrors Ark UI's TOC "With Collapsible" example — the disclosure trigger with
// the progress ring and numbered links is owned by the high-level component.
import { Page, PageContent, TableOfContents } from '@cloudvoyant/helical-react';

function Filler() {
  return <div className="mt-3 min-h-96 rounded bg-muted/30" />;
}

export default function ReactTocCollapsible() {
  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8">
          <div className="sticky top-0 z-10 mx-auto max-w-2xl bg-background py-4">
            <TableOfContents
              variant="collapsible"
              headingSelector='[data-fw="react"] :is(h2, h3, h4, h5, h6)'
              className="max-w-[22rem]"
            />
          </div>
          <div className="mx-auto flex max-w-2xl flex-col gap-10 pb-10">
            <section className="scroll-mt-24">
              <h2 id="react-04-overview" className="text-lg font-semibold">
                Overview
              </h2>
              <Filler />
            </section>
            <section className="scroll-mt-24">
              <h2 id="react-04-prerequisites" className="text-lg font-semibold">
                Prerequisites
              </h2>
              <Filler />
            </section>
            <section className="scroll-mt-24">
              <h2 id="react-04-quick-start" className="text-lg font-semibold">
                Quick Start
              </h2>
              <Filler />
            </section>
            <section className="scroll-mt-24">
              <h2 id="react-04-commands" className="text-lg font-semibold">
                Core Commands
              </h2>
              <Filler />
            </section>
            <section className="scroll-mt-24">
              <h2 id="react-04-troubleshooting" className="text-lg font-semibold">
                Troubleshooting
              </h2>
              <Filler />
            </section>
          </div>
        </PageContent>
      </Page>
    </div>
  );
}
