// apps/docs/src/components/examples/toc/rail/react.tsx
// Mirrors Ark UI's TOC "With Rail" example — the depth rail, bezier turns, and
// per-item SVG geometry live in the high-level component, not here.
import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-react';

const items = [
  { value: 'react-07-overview', depth: 2, label: 'Overview', lines: 10 },
  { value: 'react-07-installation', depth: 2, label: 'Installation', lines: 8 },
  { value: 'react-07-package-manager', depth: 3, label: 'Package Manager', lines: 12 },
  { value: 'react-07-peer-dependencies', depth: 3, label: 'Peer Dependencies', lines: 6 },
  { value: 'react-07-usage', depth: 2, label: 'Usage', lines: 14 },
  { value: 'react-07-server-components', depth: 3, label: 'Server Components', lines: 9 },
  { value: 'react-07-styling', depth: 3, label: 'Styling', lines: 11 },
  { value: 'react-07-theming', depth: 4, label: 'Theming', lines: 7 },
  { value: 'react-07-api-reference', depth: 2, label: 'API Reference', lines: 12 },
];

export default function ReactTocRail() {
  return (
    <Page className="bg-background text-foreground">
      <PageContent data-toc-scroll className="px-8 py-10">
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          {items.map((item) => (
            <section key={item.value} className="scroll-mt-8" data-depth={item.depth}>
              <h2 id={item.value} className={item.depth > 2 ? 'ps-6 text-base font-semibold' : 'text-lg font-semibold'}>
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
        <Toc items={items} variant="rail" />
      </PageGutter>
    </Page>
  );
}
