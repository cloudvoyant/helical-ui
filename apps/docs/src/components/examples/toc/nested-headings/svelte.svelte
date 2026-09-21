<!-- apps/docs/src/components/examples/toc/nested-headings/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Nested Headings" example — mixed depths, indented links. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-svelte';

  let pageEl = $state<HTMLDivElement | null>(null);

  const items = [
    { value: 'svelte-02-importance', depth: 2, label: 'Importance', lines: 10 },
    { value: 'svelte-02-integrations', depth: 2, label: 'Integrations', lines: 12 },
    { value: 'svelte-02-free-blocks', depth: 3, label: 'Free Blocks', lines: 8 },
    { value: 'svelte-02-configuration', depth: 3, label: 'Configuration', lines: 14 },
    { value: 'svelte-02-api-reference', depth: 2, label: 'API Reference', lines: 10 },
    { value: 'svelte-02-hooks', depth: 3, label: 'Hooks', lines: 8 },
    { value: 'svelte-02-components', depth: 3, label: 'Components', lines: 12 },
    { value: 'svelte-02-examples', depth: 2, label: 'Examples', lines: 10 },
  ];

</script>

<div bind:this={pageEl} data-toc-scroll-root class="h-svh overflow-y-auto overscroll-y-auto">
  <Page class="bg-background text-foreground">
  <PageContent data-toc-scroll class="px-8 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      {#each items as item (item.value)}
        <section class="scroll-mt-8" class:ps-6={item.depth > 2}>
          {#if item.depth > 2}
            <h3 id={item.value} class="text-base font-semibold">{item.label}</h3>
          {:else}
            <h2 id={item.value} class="text-lg font-semibold">{item.label}</h2>
          {/if}
          <div class="mt-3 flex flex-col gap-2">
            {#each Array.from({ length: item.lines }) as _, i (i)}
              <div class="h-2.5 rounded bg-muted"></div>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </PageContent>
  <PageGutter side="right" class="border-s border-border">
    <Toc {items} variant="default" scrollEl={() => pageEl} />
  </PageGutter>
  </Page>
</div>
