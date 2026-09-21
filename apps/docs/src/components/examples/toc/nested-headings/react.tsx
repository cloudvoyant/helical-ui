// apps/docs/src/components/examples/toc/nested-headings/react.tsx
// Mirrors Ark UI's TOC "Nested Headings" example — mixed depths, indented links.
import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-02-importance', depth: 2, label: 'Importance', lines: 10 },
  { value: 'react-02-integrations', depth: 2, label: 'Integrations', lines: 12 },
  { value: 'react-02-free-blocks', depth: 3, label: 'Free Blocks', lines: 8 },
  { value: 'react-02-configuration', depth: 3, label: 'Configuration', lines: 14 },
  { value: 'react-02-api-reference', depth: 2, label: 'API Reference', lines: 10 },
  { value: 'react-02-hooks', depth: 3, label: 'Hooks', lines: 8 },
  { value: 'react-02-components', depth: 3, label: 'Components', lines: 12 },
  { value: 'react-02-examples', depth: 2, label: 'Examples', lines: 10 },
];

export default function ReactTocNestedHeadings() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} data-toc-scroll-root className="h-svh overflow-y-auto overscroll-y-auto">
      <Page className="bg-background text-foreground">
        <PageContent data-toc-scroll className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            {items.map((item) =>
              item.depth > 2 ? (
                <section key={item.value} className="scroll-mt-8 ps-6">
                  <h3 id={item.value} className="text-base font-semibold">
                    {item.label}
                  </h3>
                  <div className="mt-3 flex flex-col gap-2">
                    {Array.from({ length: item.lines }).map((_, i) => (
                      <div key={i} className="h-2.5 rounded bg-muted" />
                    ))}
                  </div>
                </section>
              ) : (
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
              ),
            )}
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <Toc items={items} variant="default" scrollEl={() => pageRef.current} />
        </PageGutter>
      </Page>
    </div>
  );
}
