// apps/docs/src/components/examples/toc/prose/react.tsx
// helical-ui specific: the machine observes document scroll (no `scrollEl`), so
// the nav sits in a `PageGutter` beside the published `Prose` component.
import { Page, PageContent, PageGutter, Prose, Toc } from '@cloudvoyant/helical-react';

const items = [
  { value: 'react-prose-overview', depth: 2, label: 'Overview' },
  { value: 'react-prose-installation', depth: 2, label: 'Installation' },
  { value: 'react-prose-authoring', depth: 2, label: 'Authoring' },
  { value: 'react-prose-theming', depth: 2, label: 'Theming' },
  { value: 'react-prose-next-steps', depth: 2, label: 'Next Steps' },
];

export default function ReactTocProse() {
  return (
    <Page>
      <PageContent className="px-8 py-10">
        <Prose as="article" className="mx-auto max-w-2xl">
          <h1>Prose with a table of contents</h1>
          <p>
            This example composes the published <code>Prose</code> component with <code>Toc</code> in a{' '}
            <code>PageGutter</code>. Because no <code>scrollEl</code> is passed, the existing machine observes the
            document scrollbar — the same one the article uses.
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
            Give each heading an <code>id</code> that matches the item&apos;s <code>value</code>, describe the heading
            level with <code>depth</code>, and provide the visible <code>label</code>. Depth drives indentation; the six
            high-level variants drive presentation.
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
        <Toc items={items} />
      </PageGutter>
    </Page>
  );
}
