// apps/docs/src/components/examples/toc/basic/react.tsx
// Mirrors Ark UI's TOC "Basic" example through helical-ui TableOfContents.
import { Page, PageContent, PageGutter, TableOfContents } from '@cloudvoyant/helical-react';

function Filler({ lines }: { lines: number }) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-2.5 rounded bg-muted" />
      ))}
    </div>
  );
}

export default function ReactTocBasic() {
  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            <section className="scroll-mt-8">
              <h2 id="react-01-introduction" className="text-lg font-semibold">
                Introduction
              </h2>
              <Filler lines={12} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-01-getting-started" className="text-lg font-semibold">
                Getting Started
              </h2>
              <Filler lines={10} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-01-installation" className="text-lg font-semibold">
                Installation
              </h2>
              <Filler lines={8} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-01-usage" className="text-lg font-semibold">
                Usage
              </h2>
              <Filler lines={14} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-01-conclusion" className="text-lg font-semibold">
                Conclusion
              </h2>
              <Filler lines={10} />
            </section>
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <TableOfContents variant="default" headingSelector='[data-fw="react"] :is(h2, h3, h4, h5, h6)' />
        </PageGutter>
      </Page>
    </div>
  );
}
