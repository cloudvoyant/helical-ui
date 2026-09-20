// apps/docs/src/components/examples/toc/hover/react.tsx
// Mirrors Ark UI's TOC "With Hover" example — collapsed skeleton bars expand to
// links on pointer enter/leave. No pin behavior; upstream has none.
import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-react';

const items = [
  { value: 'react-05-analytics-dashboard', depth: 2, label: 'Real-time Analytics', lines: 55 },
  { value: 'react-05-cloud-storage', depth: 2, label: 'S3 Cloud Storage', lines: 14 },
  { value: 'react-05-automation-tools', depth: 2, label: 'Workflow Automation', lines: 32 },
  { value: 'react-05-crm-integration', depth: 2, label: 'Salesforce Sync', lines: 45 },
  { value: 'react-05-report-generator', depth: 2, label: 'Custom PDF Reports', lines: 20 },
];

export default function ReactTocHover() {
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
        <Toc items={items} variant="hover" />
      </PageGutter>
    </Page>
  );
}
