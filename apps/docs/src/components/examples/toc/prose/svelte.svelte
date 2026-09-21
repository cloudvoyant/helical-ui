<!-- apps/docs/src/components/examples/toc/prose/svelte.svelte -->
<!-- helical-ui specific: the machine observes the iframe document while the nav
     sits in a `PageGutter` beside the published `Prose` component. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, Prose } from '@cloudvoyant/helical-svelte';
  import TableOfContents from '@cloudvoyant/helical-svelte/table-of-contents';
</script>

<div class="min-h-dvh">
  <Page>
  <PageContent class="px-8 py-10">
    <Prose element="article" class="mx-auto max-w-2xl">
      <h1>Prose with a table of contents</h1>
      <p>
        This example composes the published <code>Prose</code> component with <code>TableOfContents</code> in a
        <code>PageGutter</code>. The existing machine observes this iframe's document viewport, which isolates active headings from movement
        on the surrounding docs page.
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
        Install the package for your framework and import <code>TableOfContents</code> from the package root. The vendored
        Ark-compatible primitives stay private, so only the high-level API appears here.
      </p>
      <h2 id="svelte-prose-authoring">Authoring</h2>
      <p>
        Give each heading a stable <code>id</code>. TableOfContents collects its text and heading level automatically, while the six
        high-level variants control presentation.
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
    <TableOfContents headingSelector='[data-fw="svelte"] :is(h2, h3, h4, h5, h6)' />
  </PageGutter>
  </Page>
</div>
