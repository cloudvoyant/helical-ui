// apps/docs/src/components/examples/toc/indicator/react.tsx
// Mirrors Ark UI's TOC "With Indicator" example — the sliding marker follows the
// active item via the machine's indicator props.
import { Page, PageContent, PageGutter, TableOfContents } from '@cloudvoyant/helical-react';

function Filler({ lines }: { lines: number }) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-2.5 rounded bg-muted" />
      ))}
    </div>
  );
}

export default function ReactTocIndicator() {
  return (
    <div className="min-h-dvh">
      <Page className="bg-background text-foreground">
        <PageContent className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            <section className="scroll-mt-8">
              <h2 id="react-06-step-validation" className="text-lg font-semibold">
                Validation Pending
              </h2>
              <Filler lines={5} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-06-upload-progress" className="text-lg font-semibold">
                Asset Uploading
              </h2>
              <Filler lines={90} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-06-deployment-sync" className="text-lg font-semibold">
                Server Sync Active
              </h2>
              <Filler lines={12} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-06-build-pipeline" className="text-lg font-semibold">
                CI/CD Running
              </h2>
              <Filler lines={105} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-06-database-health" className="text-lg font-semibold">
                DB Connection Stable
              </h2>
              <Filler lines={3} />
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-06-final-draft" className="text-lg font-semibold">
                Final Draft
              </h2>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-06-final-review" className="text-lg font-semibold">
                Final Review
              </h2>
            </section>
            <section className="scroll-mt-8">
              <h2 id="react-06-publish" className="text-lg font-semibold">
                Publish
              </h2>
            </section>
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <TableOfContents variant="indicator" headingSelector='[data-fw="react"] :is(h2, h3, h4, h5, h6)' />
        </PageGutter>
      </Page>
    </div>
  );
}
