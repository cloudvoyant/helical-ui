<!-- apps/docs/src/components/examples/toc/hover/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Hover" example — collapsed skeleton bars expand to
     links on pointer enter/leave. No pin behavior; upstream has none. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-svelte';

  let pageEl = $state<HTMLDivElement | null>(null);

  const items = [
    { value: 'svelte-05-analytics-dashboard', depth: 2, label: 'Real-time Analytics', lines: 55 },
    { value: 'svelte-05-cloud-storage', depth: 2, label: 'S3 Cloud Storage', lines: 14 },
    { value: 'svelte-05-automation-tools', depth: 2, label: 'Workflow Automation', lines: 32 },
    { value: 'svelte-05-crm-integration', depth: 2, label: 'Salesforce Sync', lines: 45 },
    { value: 'svelte-05-report-generator', depth: 2, label: 'Custom PDF Reports', lines: 20 },
  ];

</script>

<div bind:this={pageEl} data-toc-scroll-root class="h-svh overflow-y-auto overscroll-y-auto">
  <Page class="bg-background text-foreground">
  <PageContent data-toc-scroll class="px-8 py-10">
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
  <PageGutter side="right" align="center" class="border-s border-border">
    <Toc {items} variant="hover" scrollEl={() => pageEl} />
  </PageGutter>
  </Page>
</div>
