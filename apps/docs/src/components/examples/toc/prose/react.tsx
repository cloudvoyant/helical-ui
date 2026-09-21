// apps/docs/src/components/examples/toc/prose/react.tsx
// helical-ui specific: the machine observes the isolated full-preview scroll root,
// while the nav sits in a `PageGutter` beside the published `Prose` component.
import { Page, PageContent, PageGutter, Prose, Toc } from '@cloudvoyant/helical-react';
import { useRef } from 'react';

export default function ReactTocProse() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} data-toc-scroll-root className="h-svh overflow-y-auto overscroll-y-auto">
      <Page>
        <PageContent className="px-8 py-10">
          <Prose as="article" className="mx-auto max-w-2xl">
            <h1>Prose with a table of contents</h1>
            <p>
              This example composes the published <code>Prose</code> component with <code>Toc</code> in a{' '}
              <code>PageGutter</code>. The existing machine observes this preview&apos;s explicit scroll root, which
              isolates active headings from movement on the surrounding docs page.
            </p>
            <h2 id="react-prose-overview">Overview</h2>
            <p>
              The navigation is a standalone component. It never renders or owns article content; the machine resolves
              each heading with <code>document.getElementById(item.value)</code>, so headings only need matching ids.
            </p>
            <p>
              Active links, scrolling, hash updates, and <code>aria-current</code> all come from that machine — the
              example file contains no observer, scroll listener, or active-section state.
            </p>
            <h2 id="react-prose-installation">Installation</h2>
            <p>
              Install the package for your framework and import <code>Toc</code> from the package root. The vendored
              Ark-compatible primitives stay private, so only the high-level API appears here.
            </p>
            <h2 id="react-prose-authoring">Authoring</h2>
            <p>
              Give each heading a stable <code>id</code>. Toc collects its text and heading level automatically, while
              the six high-level variants control presentation.
            </p>
            <h2 id="react-prose-theming">Theming</h2>
            <p>
              Every class comes from the shared cva layer in <code>@cloudvoyant/helical-ui</code>, so the navigation
              follows the same theme tokens as the rest of the library.
            </p>
            <h2 id="react-prose-next-steps">Next Steps</h2>
            <p>
              The other examples on this page show each visual variant on its own full-page preview, including the
              externally owned machine and the TreeView composition.
            </p>
          </Prose>
        </PageContent>
        <PageGutter side="right">
          <Toc scrollEl={() => pageRef.current} />
        </PageGutter>
      </Page>
    </div>
  );
}
