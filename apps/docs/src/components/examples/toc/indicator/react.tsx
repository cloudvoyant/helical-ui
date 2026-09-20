// apps/docs/src/components/examples/toc/indicator/react.tsx
// Mirrors Ark UI's TOC "With Indicator" example — the sliding marker follows the
// active item via the machine's indicator props.
import { Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-06-step-validation', depth: 2, label: 'Validation Pending', lines: 5 },
  { value: 'react-06-upload-progress', depth: 2, label: 'Asset Uploading', lines: 90 },
  { value: 'react-06-deployment-sync', depth: 2, label: 'Server Sync Active', lines: 12 },
  { value: 'react-06-build-pipeline', depth: 2, label: 'CI/CD Running', lines: 105 },
  { value: 'react-06-database-health', depth: 2, label: 'DB Connection Stable', lines: 3 },
];

export default function ReactTocIndicator() {
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
        <Toc items={items} scrollEl={() => contentRef.current} variant="indicator" />
      </aside>
    </div>
  );
}
