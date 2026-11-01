// apps/docs/src/components/examples/toc/root-provider/react.tsx
// Mirrors Ark UI's TOC "Root Provider" example: one external machine, passed
// through `value`. The high-level TableOfContents creates none on this path.
import { Page, PageContent, PageGutter, TableOfContents, useToc } from '@cloudvoyant/helical-react';

const items = [
  { value: 'react-03-introduction', depth: 2, label: 'Introduction', lines: 12 },
  { value: 'react-03-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
  { value: 'react-03-installation', depth: 2, label: 'Installation', lines: 8 },
  { value: 'react-03-usage', depth: 2, label: 'Usage', lines: 14 },
  { value: 'react-03-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
];

export default function ReactTocRootProvider() {
  // The single machine for this example — TableOfContents must not create another.
  const toc = useToc({ items });

  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            <section className="scroll-mt-8">
              <h2 id="react-03-introduction" className="text-lg font-semibold">
                Introduction
              </h2>
              <div className="mt-3 min-h-96 rounded bg-muted/30" />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-03-getting-started" className="text-lg font-semibold">
                Getting Started
              </h2>
              <div className="mt-3 min-h-96 rounded bg-muted/30" />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-03-installation" className="text-lg font-semibold">
                Installation
              </h2>
              <div className="mt-3 min-h-96 rounded bg-muted/30" />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-03-usage" className="text-lg font-semibold">
                Usage
              </h2>
              <div className="mt-3 min-h-96 rounded bg-muted/30" />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-03-conclusion" className="text-lg font-semibold">
                Conclusion
              </h2>
              <div className="mt-3 min-h-96 rounded bg-muted/30" />
            </section>
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <output className="mb-3 block truncate font-mono text-xs text-muted-foreground">
            activeIds: {JSON.stringify(toc.activeIds)}
          </output>
          <TableOfContents items={items} value={toc} />
        </PageGutter>
      </Page>
    </div>
  );
}
