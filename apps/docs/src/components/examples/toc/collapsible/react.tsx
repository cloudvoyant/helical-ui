// apps/docs/src/components/examples/toc/collapsible/react.tsx
// Mirrors Ark UI's TOC "With Collapsible" example — the disclosure trigger with
// the progress ring and numbered links is owned by the high-level component.
import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-react';

const items = [
  { value: 'react-04-overview', depth: 2, label: 'Overview', lines: 8 },
  { value: 'react-04-prerequisites', depth: 2, label: 'Prerequisites', lines: 5 },
  { value: 'react-04-quick-start', depth: 2, label: 'Quick Start', lines: 20 },
  { value: 'react-04-commands', depth: 2, label: 'Core Commands', lines: 15 },
  { value: 'react-04-troubleshooting', depth: 2, label: 'Troubleshooting', lines: 12 },
];

export default function ReactTocCollapsible() {
  return (
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
        <Toc items={items} variant="collapsible" />
      </PageGutter>
    </Page>
  );
}
