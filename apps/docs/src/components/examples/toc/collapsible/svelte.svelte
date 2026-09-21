<!-- apps/docs/src/components/examples/toc/collapsible/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Collapsible" example — the disclosure trigger with
     the progress ring and numbered links is owned by the high-level component. -->
<script lang="ts">
  import { Page, PageContent, Toc } from '@cloudvoyant/helical-svelte';

  let pageEl = $state<HTMLDivElement | null>(null);

  const sections = [
    { value: 'svelte-04-overview', depth: 2, label: 'Overview', lines: 8 },
    { value: 'svelte-04-prerequisites', depth: 2, label: 'Prerequisites', lines: 5 },
    { value: 'svelte-04-quick-start', depth: 2, label: 'Quick Start', lines: 20 },
    { value: 'svelte-04-commands', depth: 2, label: 'Core Commands', lines: 15 },
    { value: 'svelte-04-troubleshooting', depth: 2, label: 'Troubleshooting', lines: 12 },
  ];

</script>

<div bind:this={pageEl} data-toc-scroll-root class="h-svh overflow-y-auto overscroll-y-auto">
  <Page class="bg-background text-foreground">
  <PageContent data-toc-scroll class="px-8">
    <div data-toc-sticky class="sticky top-0 z-10 mx-auto max-w-2xl bg-background py-4">
      <Toc variant="collapsible" scrollEl={() => pageEl} class="max-w-[22rem]" />
    </div>
    <div class="mx-auto flex max-w-2xl flex-col gap-10 pb-10">
      {#each sections as item (item.value)}
        <section class="scroll-mt-24">
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
  </Page>
</div>
