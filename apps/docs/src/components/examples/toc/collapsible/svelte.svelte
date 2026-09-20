<!-- apps/docs/src/components/examples/toc/collapsible/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Collapsible" example — the disclosure trigger with
     the progress ring and numbered links is owned by the high-level component. -->
<script lang="ts">
  import { Toc } from '@cloudvoyant/helical-svelte';

  const items = [
    { value: 'svelte-04-overview', depth: 2, label: 'Overview', lines: 8 },
    { value: 'svelte-04-prerequisites', depth: 2, label: 'Prerequisites', lines: 5 },
    { value: 'svelte-04-quick-start', depth: 2, label: 'Quick Start', lines: 20 },
    { value: 'svelte-04-commands', depth: 2, label: 'Core Commands', lines: 15 },
    { value: 'svelte-04-troubleshooting', depth: 2, label: 'Troubleshooting', lines: 12 },
  ];

  let contentRef: HTMLElement | null = $state(null);
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
    <Toc {items} scrollEl={() => contentRef} variant="collapsible" />
  </aside>
</div>
