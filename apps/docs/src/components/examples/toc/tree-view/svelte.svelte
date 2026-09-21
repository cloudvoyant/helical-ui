<!-- apps/docs/src/components/examples/toc/tree-view/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Tree View" example. The section hierarchy drives
     article content; TableOfContents collects the rendered heading depths and
     derives the TreeView collection and its expansion state. -->
<script lang="ts">
  import { Page, PageContent, PageGutter } from '@cloudvoyant/helical-svelte';
  import TableOfContents from '@cloudvoyant/helical-svelte/table-of-contents';

</script>

{#snippet filler(lines: number)}
  <div class="mt-3 flex flex-col gap-2">
    {#each Array.from({ length: lines }) as _, index (index)}
      <div class="h-2.5 rounded bg-muted"></div>
    {/each}
  </div>
{/snippet}

<div class="min-h-dvh">
  <Page class="bg-background text-foreground">
  <PageContent class="px-8 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      <section class="scroll-mt-8">
        <h2 id="svelte-09-guides" class="text-lg font-semibold">Guides</h2>
        {@render filler(10)}
        <div class="mt-6 scroll-mt-8 ps-6">
          <h3 id="svelte-09-quick-start" class="text-base font-semibold">Quick Start</h3>
          {@render filler(6)}
        </div>
        <div class="mt-6 scroll-mt-8 ps-6">
          <h3 id="svelte-09-manual-setup" class="text-base font-semibold">Manual Setup</h3>
          {@render filler(5)}
        </div>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-09-core-concepts" class="text-lg font-semibold">Core Concepts</h2>
        {@render filler(9)}
        <div class="mt-6 scroll-mt-8 ps-6">
          <h3 id="svelte-09-toc-props" class="text-base font-semibold">Props</h3>
          {@render filler(7)}
        </div>
        <div class="mt-6 scroll-mt-8 ps-6">
          <h3 id="svelte-09-toc-events" class="text-base font-semibold">Events</h3>
          {@render filler(6)}
        </div>
        <div class="mt-6 scroll-mt-8 ps-6">
          <h3 id="svelte-09-toc-context" class="text-base font-semibold">Context</h3>
          {@render filler(8)}
        </div>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-09-advanced" class="text-lg font-semibold">Advanced</h2>
        {@render filler(11)}
        <div class="mt-6 scroll-mt-8 ps-6">
          <h3 id="svelte-09-root-api" class="text-base font-semibold">Root Provider</h3>
          {@render filler(7)}
        </div>
        <div class="mt-6 scroll-mt-8 ps-6">
          <h3 id="svelte-09-custom-rendering" class="text-base font-semibold">Custom Rendering</h3>
          {@render filler(6)}
        </div>
      </section>
    </div>
  </PageContent>
  <PageGutter side="right" class="border-s border-border">
    <TableOfContents
      variant="tree"
      headingSelector='[data-fw="svelte"] :is(h2, h3, h4, h5, h6)'
    />
  </PageGutter>
  </Page>
</div>
