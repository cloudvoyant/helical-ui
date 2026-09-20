// apps/docs/src/components/examples/toc/hover/react.tsx
// Mirrors Ark UI's TOC "With Hover" example — collapsed skeleton bars expand to
// links on pointer enter/leave. No pin behavior; upstream has none.
import { Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-05-analytics-dashboard', depth: 2, label: 'Real-time Analytics', lines: 55 },
  { value: 'react-05-cloud-storage', depth: 2, label: 'S3 Cloud Storage', lines: 14 },
  { value: 'react-05-automation-tools', depth: 2, label: 'Workflow Automation', lines: 32 },
  { value: 'react-05-crm-integration', depth: 2, label: 'Salesforce Sync', lines: 45 },
  { value: 'react-05-report-generator', depth: 2, label: 'Custom PDF Reports', lines: 20 },
];

export default function ReactTocHover() {
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
        <Toc items={items} scrollEl={() => contentRef.current} variant="hover" />
      </aside>
    </div>
  );
}
