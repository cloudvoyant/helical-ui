<!-- apps/docs/src/components/examples/toc/indicator/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Indicator" example — the sliding marker follows the
     active item via the machine's indicator props. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-svelte';

  let pageEl = $state<HTMLDivElement | null>(null);

  const sections = [
    { value: 'svelte-06-step-validation', depth: 2, label: 'Validation Pending', lines: 5 },
    { value: 'svelte-06-upload-progress', depth: 2, label: 'Asset Uploading', lines: 90 },
    { value: 'svelte-06-deployment-sync', depth: 2, label: 'Server Sync Active', lines: 12 },
    { value: 'svelte-06-build-pipeline', depth: 2, label: 'CI/CD Running', lines: 105 },
    { value: 'svelte-06-database-health', depth: 2, label: 'DB Connection Stable', lines: 3 },
    { value: 'svelte-06-final-draft', depth: 2, label: 'Final Draft', lines: 0 },
    { value: 'svelte-06-final-review', depth: 2, label: 'Final Review', lines: 0 },
    { value: 'svelte-06-publish', depth: 2, label: 'Publish', lines: 0 },
  ];

</script>

<div bind:this={pageEl} data-toc-scroll-root class="h-svh overflow-y-auto overscroll-y-auto">
  <Page class="bg-background text-foreground">
  <PageContent data-toc-scroll class="px-8 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      {#each sections as item (item.value)}
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
    <Toc variant="indicator" scrollEl={() => pageEl} />
  </PageGutter>
  </Page>
</div>
