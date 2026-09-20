// apps/docs/src/components/examples/toc/collapsible/react.tsx
// Mirrors Ark UI's TOC "With Collapsible" example — the disclosure trigger with
// the progress ring and numbered links is owned by the high-level component.
import { Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-04-overview', depth: 2, label: 'Overview', lines: 8 },
  { value: 'react-04-prerequisites', depth: 2, label: 'Prerequisites', lines: 5 },
  { value: 'react-04-quick-start', depth: 2, label: 'Quick Start', lines: 20 },
  { value: 'react-04-commands', depth: 2, label: 'Core Commands', lines: 15 },
  { value: 'react-04-troubleshooting', depth: 2, label: 'Troubleshooting', lines: 12 },
];

export default function ReactTocCollapsible() {
  const contentRef = useRef<HTMLElement | null>(null);

  return (
    <div className="grid min-h-dvh grid-cols-[minmax(0,1fr)_16rem] bg-background text-foreground">
      <main ref={contentRef} data-toc-scroll className="h-dvh overflow-y-auto p-8">
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
      </main>
      <aside className="h-dvh border-s border-border p-6">
        <Toc items={items} scrollEl={() => contentRef.current} variant="collapsible" />
      </aside>
    </div>
  );
}
