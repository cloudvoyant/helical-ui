<!-- apps/docs/src/components/examples/toc/basic/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Basic" example through the high-level helical-ui Toc. -->
<script lang="ts">
  import { Toc } from '@cloudvoyant/helical-svelte';

  const items = [
    { value: 'svelte-01-introduction', depth: 2, label: 'Introduction', lines: 12 },
    { value: 'svelte-01-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
    { value: 'svelte-01-installation', depth: 2, label: 'Installation', lines: 8 },
    { value: 'svelte-01-usage', depth: 2, label: 'Usage', lines: 14 },
    { value: 'svelte-01-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
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
    <Toc {items} scrollEl={() => contentRef} variant="default" />
  </aside>
</div>
