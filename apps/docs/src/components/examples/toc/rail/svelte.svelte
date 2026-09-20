<!-- apps/docs/src/components/examples/toc/rail/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Rail" example — the depth rail, bezier turns, and
     per-item SVG geometry live in the high-level component, not here. -->
<script lang="ts">
  import { Toc } from '@cloudvoyant/helical-svelte';

  const items = [
    { value: 'svelte-07-overview', depth: 2, label: 'Overview', lines: 10 },
    { value: 'svelte-07-installation', depth: 2, label: 'Installation', lines: 8 },
    { value: 'svelte-07-package-manager', depth: 3, label: 'Package Manager', lines: 12 },
    { value: 'svelte-07-peer-dependencies', depth: 3, label: 'Peer Dependencies', lines: 6 },
    { value: 'svelte-07-usage', depth: 2, label: 'Usage', lines: 14 },
    { value: 'svelte-07-server-components', depth: 3, label: 'Server Components', lines: 9 },
    { value: 'svelte-07-styling', depth: 3, label: 'Styling', lines: 11 },
    { value: 'svelte-07-theming', depth: 4, label: 'Theming', lines: 7 },
    { value: 'svelte-07-api-reference', depth: 2, label: 'API Reference', lines: 12 },
  ];

  let contentRef: HTMLElement | null = $state(null);
</script>

<div class="grid min-h-dvh grid-cols-[minmax(0,1fr)_16rem] bg-background text-foreground">
  <main bind:this={contentRef} data-toc-scroll class="h-dvh overflow-y-auto p-8">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      {#each items as item (item.value)}
        <section class="scroll-mt-8" data-depth={item.depth}>
          <h2
            id={item.value}
            class={item.depth > 2 ? 'ps-6 text-base font-semibold' : 'text-lg font-semibold'}
          >
            {item.label}
          </h2>
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
    <Toc {items} scrollEl={() => contentRef} variant="rail" />
  </aside>
</div>
