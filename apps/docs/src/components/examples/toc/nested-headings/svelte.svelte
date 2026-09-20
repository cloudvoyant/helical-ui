<!-- apps/docs/src/components/examples/toc/nested-headings/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Nested Headings" example — mixed depths, indented links. -->
<script lang="ts">
  import { Toc } from '@cloudvoyant/helical-svelte';

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

  let contentRef: HTMLElement | null = $state(null);
</script>

<div class="grid min-h-dvh grid-cols-[minmax(0,1fr)_16rem] bg-background text-foreground">
  <main bind:this={contentRef} data-toc-scroll class="h-dvh overflow-y-auto p-8">
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
  </main>
  <aside class="h-dvh border-s border-border p-6">
    <Toc {items} scrollEl={() => contentRef} variant="default" />
  </aside>
</div>
