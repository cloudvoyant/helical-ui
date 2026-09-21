<!-- apps/docs/src/components/examples/toc/basic/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Basic" example through helical-ui TableOfContents. -->
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
        <h2 id="svelte-01-introduction" class="text-lg font-semibold">Introduction</h2>
        {@render filler(12)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-01-getting-started" class="text-lg font-semibold">Getting Started</h2>
        {@render filler(10)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-01-installation" class="text-lg font-semibold">Installation</h2>
        {@render filler(8)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-01-usage" class="text-lg font-semibold">Usage</h2>
        {@render filler(14)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-01-conclusion" class="text-lg font-semibold">Conclusion</h2>
        {@render filler(10)}
      </section>
    </div>
  </PageContent>
  <PageGutter side="right" class="border-s border-border">
    <TableOfContents
      variant="default"
      headingSelector='[data-fw="svelte"] :is(h2, h3, h4, h5, h6)'
    />
  </PageGutter>
  </Page>
</div>
