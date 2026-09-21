// apps/docs/src/components/examples/toc/tree-view/react.tsx
// Mirrors Ark UI's TOC "With Tree View" example. The section hierarchy drives
// article content; Toc collects the rendered heading depths and derives the
// TreeView collection and its expansion state.
import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

type Section = {
  id: string;
  name: string;
  lines: number;
  children?: Section[];
};

const sections: Section[] = [
  {
    id: 'react-09-guides',
    name: 'Guides',
    lines: 10,
    children: [
      { id: 'react-09-quick-start', name: 'Quick Start', lines: 6 },
      { id: 'react-09-manual-setup', name: 'Manual Setup', lines: 5 },
    ],
  },
  {
    id: 'react-09-core-concepts',
    name: 'Core Concepts',
    lines: 9,
    children: [
      { id: 'react-09-toc-props', name: 'Props', lines: 7 },
      { id: 'react-09-toc-events', name: 'Events', lines: 6 },
      { id: 'react-09-toc-context', name: 'Context', lines: 8 },
    ],
  },
  {
    id: 'react-09-advanced',
    name: 'Advanced',
    lines: 11,
    children: [
      { id: 'react-09-root-api', name: 'Root Provider', lines: 7 },
      { id: 'react-09-custom-rendering', name: 'Custom Rendering', lines: 6 },
    ],
  },
];

export default function ReactTocTreeView() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} data-toc-scroll-root className="h-svh overflow-y-auto overscroll-y-auto">
      <Page className="bg-background text-foreground">
        <PageContent data-toc-scroll className="px-8 py-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-10">
            {sections.map((section) => (
              <section key={section.id} className="scroll-mt-8">
                <h2 id={section.id} className="text-lg font-semibold">
                  {section.name}
                </h2>
                <div className="mt-3 flex flex-col gap-2">
                  {Array.from({ length: section.lines }).map((_, i) => (
                    <div key={i} className="h-2.5 rounded bg-muted" />
                  ))}
                </div>
                {(section.children ?? []).map((child) => (
                  <div key={child.id} className="mt-6 scroll-mt-8 ps-6">
                    <h3 id={child.id} className="text-base font-semibold">
                      {child.name}
                    </h3>
                    <div className="mt-3 flex flex-col gap-2">
                      {Array.from({ length: child.lines }).map((_, i) => (
                        <div key={i} className="h-2.5 rounded bg-muted" />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </PageContent>
        <PageGutter side="right" className="border-s border-border">
          <Toc variant="tree" scrollEl={() => pageRef.current} />
        </PageGutter>
      </Page>
    </div>
  );
}
