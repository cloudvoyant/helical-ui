// apps/docs/src/components/examples/toc/tree-view/react.tsx
// Mirrors Ark UI's TOC "With Tree View" example. The section hierarchy drives
// article content; TableOfContents collects the rendered heading depths and
// derives the TreeView collection and its expansion state.
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

export default function ReactTocTreeView() {
  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            <section className="scroll-mt-8">
              <h2 id="react-09-guides" className="text-lg font-semibold">
                Guides
              </h2>
              <Filler lines={10} />
              <div className="mt-6 scroll-mt-8 ps-6">
                <h3 id="react-09-quick-start" className="text-base font-semibold">
                  Quick Start
                </h3>
                <Filler lines={6} />
              </div>
              <div className="mt-6 scroll-mt-8 ps-6">
                <h3 id="react-09-manual-setup" className="text-base font-semibold">
                  Manual Setup
                </h3>
                <Filler lines={5} />
              </div>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-09-core-concepts" className="text-lg font-semibold">
                Core Concepts
              </h2>
              <Filler lines={9} />
              <div className="mt-6 scroll-mt-8 ps-6">
                <h3 id="react-09-toc-props" className="text-base font-semibold">
                  Props
                </h3>
                <Filler lines={7} />
              </div>
              <div className="mt-6 scroll-mt-8 ps-6">
                <h3 id="react-09-toc-events" className="text-base font-semibold">
                  Events
                </h3>
                <Filler lines={6} />
              </div>
              <div className="mt-6 scroll-mt-8 ps-6">
                <h3 id="react-09-toc-context" className="text-base font-semibold">
                  Context
                </h3>
                <Filler lines={8} />
              </div>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-09-advanced" className="text-lg font-semibold">
                Advanced
              </h2>
              <Filler lines={11} />
              <div className="mt-6 scroll-mt-8 ps-6">
                <h3 id="react-09-root-api" className="text-base font-semibold">
                  Root Provider
                </h3>
                <Filler lines={7} />
              </div>
              <div className="mt-6 scroll-mt-8 ps-6">
                <h3 id="react-09-custom-rendering" className="text-base font-semibold">
                  Custom Rendering
                </h3>
                <Filler lines={6} />
              </div>
            </section>
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <TableOfContents variant="tree" headingSelector='[data-fw="react"] :is(h2, h3, h4, h5, h6)' />
        </PageGutter>
      </Page>
    </div>
  );
}
