<!-- apps/docs/src/components/examples/toc/nested-headings/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Nested Headings" example — mixed depths, indented links. -->
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
        <h2 id="svelte-02-importance" class="text-lg font-semibold">Importance</h2>
        {@render filler(10)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-02-integrations" class="text-lg font-semibold">Integrations</h2>
        {@render filler(12)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-02-free-blocks" class="text-base font-semibold">Free Blocks</h3>
        {@render filler(8)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-02-configuration" class="text-base font-semibold">Configuration</h3>
        {@render filler(14)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-02-api-reference" class="text-lg font-semibold">API Reference</h2>
        {@render filler(10)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-02-hooks" class="text-base font-semibold">Hooks</h3>
        {@render filler(8)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-02-components" class="text-base font-semibold">Components</h3>
        {@render filler(12)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-02-examples" class="text-lg font-semibold">Examples</h2>
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
