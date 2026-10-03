<!-- apps/docs/src/components/examples/toc/root-provider/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Root Provider" example: one external machine accessor,
     passed through `value`. The `{#if value}` branch mounts TocView only, so
     TocOwned never runs and no second machine is created. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, useToc } from '@cloudvoyant/helical-svelte';
  import TableOfContents from '@cloudvoyant/helical-svelte/table-of-contents';

  const items = [
    { value: 'svelte-03-introduction', depth: 2, label: 'Introduction', lines: 12 },
    { value: 'svelte-03-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
    { value: 'svelte-03-installation', depth: 2, label: 'Installation', lines: 8 },
    { value: 'svelte-03-usage', depth: 2, label: 'Usage', lines: 14 },
    { value: 'svelte-03-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
  ];

  // The single machine for this example — TableOfContents must not create another.
  const toc = useToc(() => ({ items }));
</script>

<div class="min-h-dvh">
  <Page class="bg-background text-foreground">
  <PageContent class="px-8 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      {#each items as item (item.value)}
        <section class="scroll-mt-8">
          <h2 id={item.value} class="text-lg font-semibold">{item.label}</h2>
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
    <output class="mb-3 block truncate font-mono text-xs text-muted-foreground">
      activeIds: {JSON.stringify(toc().activeIds)}
    </output>
    <TableOfContents {items} value={toc} />
  </PageGutter>
  </Page>
</div>
