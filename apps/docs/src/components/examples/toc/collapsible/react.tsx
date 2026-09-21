// apps/docs/src/components/examples/toc/collapsible/react.tsx
// Mirrors Ark UI's TOC "With Collapsible" example — the disclosure trigger with
// the progress ring and numbered links is owned by the high-level component.
import { Page, PageContent, Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-04-overview', depth: 2, label: 'Overview', lines: 8 },
  { value: 'react-04-prerequisites', depth: 2, label: 'Prerequisites', lines: 5 },
  { value: 'react-04-quick-start', depth: 2, label: 'Quick Start', lines: 20 },
  { value: 'react-04-commands', depth: 2, label: 'Core Commands', lines: 15 },
  { value: 'react-04-troubleshooting', depth: 2, label: 'Troubleshooting', lines: 12 },
];

export default function ReactTocCollapsible() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} data-toc-scroll-root className="h-svh overflow-y-auto overscroll-y-auto">
      <Page className="bg-background text-foreground">
        <PageContent data-toc-scroll className="px-8">
          <div data-toc-sticky className="sticky top-0 z-10 mx-auto max-w-2xl bg-background py-4">
            <Toc items={items} variant="collapsible" scrollEl={() => pageRef.current} className="max-w-[22rem]" />
          </div>
          <div className="mx-auto flex max-w-2xl flex-col gap-10 pb-10">
            {items.map((item) => (
              <section key={item.value} className="scroll-mt-24">
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
      </Page>
    </div>
  );
}
