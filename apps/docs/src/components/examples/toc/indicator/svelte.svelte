<!-- apps/docs/src/components/examples/toc/indicator/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Indicator" example — the sliding marker follows the
     active item via the machine's indicator props. -->
<script lang="ts">
  import { Toc } from '@cloudvoyant/helical-svelte';

  const items = [
    { value: 'svelte-06-step-validation', depth: 2, label: 'Validation Pending', lines: 5 },
    { value: 'svelte-06-upload-progress', depth: 2, label: 'Asset Uploading', lines: 90 },
    { value: 'svelte-06-deployment-sync', depth: 2, label: 'Server Sync Active', lines: 12 },
    { value: 'svelte-06-build-pipeline', depth: 2, label: 'CI/CD Running', lines: 105 },
    { value: 'svelte-06-database-health', depth: 2, label: 'DB Connection Stable', lines: 3 },
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
    <Toc {items} scrollEl={() => contentRef} variant="indicator" />
  </aside>
</div>
