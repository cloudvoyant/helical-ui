<!-- apps/docs/src/components/examples/toc/basic/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "Basic" example through the high-level helical-ui Toc. -->
<script lang="ts">
  import { Page, PageContent, PageGutter, Toc } from '@cloudvoyant/helical-svelte';

  let pageEl = $state<HTMLDivElement | null>(null);

  const sections = [
    { value: 'svelte-01-introduction', depth: 2, label: 'Introduction', lines: 12 },
    { value: 'svelte-01-getting-started', depth: 2, label: 'Getting Started', lines: 10 },
    { value: 'svelte-01-installation', depth: 2, label: 'Installation', lines: 8 },
    { value: 'svelte-01-usage', depth: 2, label: 'Usage', lines: 14 },
    { value: 'svelte-01-conclusion', depth: 2, label: 'Conclusion', lines: 10 },
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
    <Toc variant="default" scrollEl={() => pageEl} />
  </PageGutter>
  </Page>
</div>
