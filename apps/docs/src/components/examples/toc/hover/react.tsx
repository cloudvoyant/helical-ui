// apps/docs/src/components/examples/toc/hover/react.tsx
// Mirrors Ark UI's TOC "With Hover" example — collapsed skeleton bars expand to
// links on pointer enter/leave. No pin behavior; upstream has none.
import { Page, PageContent, PageGutter, TableOfContents } from '@cloudvoyant/helical-react';

export default function ReactTocHover() {
  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            <section className="scroll-mt-8">
              <h2 id="react-05-analytics-dashboard" className="text-lg font-semibold">
                Real-time Analytics
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {Array.from({ length: 55 }).map((_, i) => (
                  <div key={i} className="h-2.5 rounded bg-muted" />
                ))}
              </div>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-05-cloud-storage" className="text-lg font-semibold">
                S3 Cloud Storage
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="h-2.5 rounded bg-muted" />
                ))}
              </div>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-05-automation-tools" className="text-lg font-semibold">
                Workflow Automation
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="h-2.5 rounded bg-muted" />
                ))}
              </div>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-05-crm-integration" className="text-lg font-semibold">
                Salesforce Sync
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {Array.from({ length: 45 }).map((_, i) => (
                  <div key={i} className="h-2.5 rounded bg-muted" />
                ))}
              </div>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-05-report-generator" className="text-lg font-semibold">
                Custom PDF Reports
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-2.5 rounded bg-muted" />
                ))}
              </div>
            </section>
          </div>
        </PageContent>
        <PageGutter side="right" align="center" className="border-s border-border">
          <TableOfContents variant="hover" headingSelector='[data-fw="react"] :is(h2, h3, h4, h5, h6)' />
        </PageGutter>
      </Page>
    </div>
  );
}
