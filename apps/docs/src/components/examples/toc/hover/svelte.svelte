<!-- apps/docs/src/components/examples/toc/hover/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Hover" example — collapsed skeleton bars expand to
     links on pointer enter/leave. No pin behavior; upstream has none. -->
<script lang="ts">
  import { Toc } from '@cloudvoyant/helical-svelte';

  const items = [
    { value: 'svelte-05-analytics-dashboard', depth: 2, label: 'Real-time Analytics', lines: 55 },
    { value: 'svelte-05-cloud-storage', depth: 2, label: 'S3 Cloud Storage', lines: 14 },
    { value: 'svelte-05-automation-tools', depth: 2, label: 'Workflow Automation', lines: 32 },
    { value: 'svelte-05-crm-integration', depth: 2, label: 'Salesforce Sync', lines: 45 },
    { value: 'svelte-05-report-generator', depth: 2, label: 'Custom PDF Reports', lines: 20 },
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
    <Toc {items} scrollEl={() => contentRef} variant="hover" />
  </aside>
</div>
