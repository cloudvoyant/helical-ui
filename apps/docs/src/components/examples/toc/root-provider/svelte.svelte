<!-- apps/docs/src/components/examples/toc/root-provider/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Root Provider" example: one external machine accessor,
     passed through `value`. The `{#if value}` branch mounts TocView only, so
     TocOwned never runs and no second machine is created. -->
<script lang="ts">
  import { Toc, useToc } from '@cloudvoyant/helical-svelte';

  const items = [
    { value: 'svelte-03-introduction', depth: 2, label: 'Introduction', lines: 12 },
    { value: 'svelte-03-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
    { value: 'svelte-03-installation', depth: 2, label: 'Installation', lines: 8 },
    { value: 'svelte-03-usage', depth: 2, label: 'Usage', lines: 14 },
    { value: 'svelte-03-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
  ];

  let contentRef: HTMLElement | null = $state(null);
  // The single machine for this example — Toc must not create another.
  const toc = useToc(() => ({ items, scrollEl: () => contentRef }));
</script>

<div class="grid min-h-dvh grid-cols-[minmax(0,1fr)_16rem] bg-background text-foreground">
  <main bind:this={contentRef} data-toc-scroll class="h-dvh overflow-y-auto p-8">
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
  </main>
  <aside class="h-dvh border-s border-border p-6">
    <output data-toc-active-ids class="mb-3 block truncate font-mono text-xs text-muted-foreground">
      activeIds: {JSON.stringify(toc().activeIds)}
    </output>
    <Toc {items} value={toc} />
  </aside>
</div>
