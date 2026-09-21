// apps/docs/src/components/examples/toc/root-provider/react.tsx
// Mirrors Ark UI's TOC "Root Provider" example: one external machine, passed
// through `value`. The high-level Toc creates none on this path.
import { Page, PageContent, PageGutter, Toc, useToc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-03-introduction', depth: 2, label: 'Introduction', lines: 12 },
  { value: 'react-03-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
  { value: 'react-03-installation', depth: 2, label: 'Installation', lines: 8 },
  { value: 'react-03-usage', depth: 2, label: 'Usage', lines: 14 },
  { value: 'react-03-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
];

export default function ReactTocRootProvider() {
  const pageRef = useRef<HTMLDivElement>(null);
  // The single machine for this example — Toc must not create another.
  const toc = useToc({ items, scrollEl: () => pageRef.current });

  return (
    <div ref={pageRef} data-toc-scroll-root className="h-svh overflow-y-auto overscroll-y-auto">
      <Page className="bg-background text-foreground">
        <PageContent data-toc-scroll className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            {items.map((item) => (
              <section key={item.value} className="scroll-mt-8">
                <h2 id={item.value} className="text-lg font-semibold">
                  {item.label}
                </h2>
                <div className="mt-3 flex flex-col gap-2">
                  {Array.from({ length: item.lines }).map((_, i) => (
                    <div key={i} className="h-2.5 rounded bg-muted" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <output data-toc-active-ids className="mb-3 block truncate font-mono text-xs text-muted-foreground">
            activeIds: {JSON.stringify(toc.activeIds)}
          </output>
          <Toc items={items} value={toc} />
        </PageGutter>
      </Page>
    </div>
  );
}
