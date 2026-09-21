// apps/docs/src/components/examples/toc/nested-headings/react.tsx
// Mirrors Ark UI's TOC "Nested Headings" example — mixed depths, indented links.
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

export default function ReactTocNestedHeadings() {
  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            <section className="scroll-mt-8">
              <h2 id="react-02-importance" className="text-lg font-semibold">
                Importance
              </h2>
              <Filler lines={10} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-02-integrations" className="text-lg font-semibold">
                Integrations
              </h2>
              <Filler lines={12} />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-02-free-blocks" className="text-base font-semibold">
                Free Blocks
              </h3>
              <Filler lines={8} />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-02-configuration" className="text-base font-semibold">
                Configuration
              </h3>
              <Filler lines={14} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-02-api-reference" className="text-lg font-semibold">
                API Reference
              </h2>
              <Filler lines={10} />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-02-hooks" className="text-base font-semibold">
                Hooks
              </h3>
              <Filler lines={8} />
            </section>
            <section className="scroll-mt-8 ps-6">
              <h3 id="react-02-components" className="text-base font-semibold">
                Components
              </h3>
              <Filler lines={12} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-02-examples" className="text-lg font-semibold">
                Examples
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
