// apps/docs/src/components/examples/toc/indicator/react.tsx
// Mirrors Ark UI's TOC "With Indicator" example — the sliding marker follows the
// active item via the machine's indicator props.
import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

const items = [
  { value: 'react-06-step-validation', depth: 2, label: 'Validation Pending', lines: 5 },
  { value: 'react-06-upload-progress', depth: 2, label: 'Asset Uploading', lines: 90 },
  { value: 'react-06-deployment-sync', depth: 2, label: 'Server Sync Active', lines: 12 },
  { value: 'react-06-build-pipeline', depth: 2, label: 'CI/CD Running', lines: 105 },
  { value: 'react-06-database-health', depth: 2, label: 'DB Connection Stable', lines: 3 },
  { value: 'react-06-final-draft', depth: 2, label: 'Final Draft', lines: 0 },
  { value: 'react-06-final-review', depth: 2, label: 'Final Review', lines: 0 },
  { value: 'react-06-publish', depth: 2, label: 'Publish', lines: 0 },
];

export default function ReactTocIndicator() {
  const pageRef = useRef<HTMLDivElement>(null);

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
          <Toc items={items} variant="indicator" scrollEl={() => pageRef.current} />
        </PageGutter>
      </Page>
    </div>
  );
}
