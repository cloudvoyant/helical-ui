// apps/docs/src/components/examples/toc/root-provider/react.tsx
// Mirrors Ark UI's TOC "Root Provider" example: one external machine, passed
// through `value`. The high-level Toc creates none on this path.
import { Toc, useToc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-03-introduction', depth: 2, label: 'Introduction', lines: 12 },
  { value: 'react-03-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
  { value: 'react-03-installation', depth: 2, label: 'Installation', lines: 8 },
  { value: 'react-03-usage', depth: 2, label: 'Usage', lines: 14 },
  { value: 'react-03-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
];

export default function ReactTocRootProvider() {
  const contentRef = useRef<HTMLElement | null>(null);
  // The single machine for this example — Toc must not create another.
  const toc = useToc({ items, scrollEl: () => contentRef.current });

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
        <output data-toc-active-ids className="mb-3 block truncate font-mono text-xs text-muted-foreground">
          activeIds: {JSON.stringify(toc.activeIds)}
        </output>
        <Toc items={items} value={toc} />
      </aside>
    </div>
  );
}
