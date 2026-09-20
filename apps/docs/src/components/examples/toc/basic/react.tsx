// apps/docs/src/components/examples/toc/basic/react.tsx
// Mirrors Ark UI's TOC "Basic" example through the high-level helical-ui Toc.
import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-react';

const items = [
  { value: 'react-01-introduction', depth: 2, label: 'Introduction', lines: 12 },
  { value: 'react-01-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
  { value: 'react-01-installation', depth: 2, label: 'Installation', lines: 8 },
  { value: 'react-01-usage', depth: 2, label: 'Usage', lines: 14 },
  { value: 'react-01-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
];

export default function ReactTocBasic() {
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
        <Toc items={items} variant="default" />
      </PageGutter>
    </Page>
  );
}
