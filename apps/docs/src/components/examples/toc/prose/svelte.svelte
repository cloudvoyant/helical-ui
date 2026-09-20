<!-- apps/docs/src/components/examples/toc/prose/svelte.svelte -->
<!-- helical-ui specific: the machine observes document scroll (no `scrollEl`), so
     the nav sits in a `PageGutter` beside the published `Prose` component. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, Prose, Toc } from '@cloudvoyant/helical-svelte';

  const items = [
    { value: 'svelte-prose-overview', depth: 2, label: 'Overview' },
    { value: 'svelte-prose-installation', depth: 2, label: 'Installation' },
    { value: 'svelte-prose-authoring', depth: 2, label: 'Authoring' },
    { value: 'svelte-prose-theming', depth: 2, label: 'Theming' },
    { value: 'svelte-prose-next-steps', depth: 2, label: 'Next Steps' },
  ];
</script>

<Page>
  <PageContent class="px-8 py-10">
    <Prose element="article" class="mx-auto max-w-2xl">
      <h1>Prose with a table of contents</h1>
      <p>
        This example composes the published <code>Prose</code> component with <code>Toc</code> in a
        <code>PageGutter</code>. Because no <code>scrollEl</code> is passed, the existing machine observes the
        document scrollbar — the same one the article uses.
      </p>
      <h2 id="svelte-prose-overview">Overview</h2>
      <p>
        The navigation is a standalone component. It never renders or owns article content; the machine resolves each
        heading with <code>document.getElementById(item.value)</code>, so headings only need matching ids.
      </p>
      <p>
        Active links, scrolling, hash updates, and <code>aria-current</code> all come from that machine — the example
        file contains no observer, scroll listener, or active-section state.
      </p>
      <h2 id="svelte-prose-installation">Installation</h2>
      <p>
        Install the package for your framework and import <code>Toc</code> from the package root. The vendored
        Ark-compatible primitives stay private, so only the high-level API appears here.
      </p>
      <h2 id="svelte-prose-authoring">Authoring</h2>
      <p>
        Give each heading an <code>id</code> that matches the item's <code>value</code>, describe the heading level with
        <code>depth</code>, and provide the visible <code>label</code>. Depth drives indentation; the six high-level
        variants drive presentation.
      </p>
      <h2 id="svelte-prose-theming">Theming</h2>
      <p>
        Every class comes from the shared cva layer in <code>@cloudvoyant/helical-ui</code>, so the navigation follows
        the same theme tokens as the rest of the library.
      </p>
      <h2 id="svelte-prose-next-steps">Next Steps</h2>
      <p>
        The other examples on this page show each visual variant on its own full-page preview, including the externally
        owned machine and the TreeView composition.
      </p>
    </Prose>
  </PageContent>
  <PageGutter side="right">
    <Toc {items} />
  </PageGutter>
</Page>
