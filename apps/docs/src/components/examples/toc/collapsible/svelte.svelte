<!-- apps/docs/src/components/examples/toc/collapsible/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Collapsible" example — the disclosure trigger with
     the progress ring and numbered links is owned by the high-level component. -->
<script lang="ts">
  import { Page, PageContent } from '@cloudvoyant/helical-svelte';
  import TableOfContents from '@cloudvoyant/helical-svelte/table-of-contents';

</script>

{#snippet filler(lines: number)}
  <div class="mt-3 flex flex-col gap-2">
    {#each Array.from({ length: lines }) as _, index (index)}
      <div class="h-2.5 rounded bg-muted"></div>
    {/each}
  </div>
{/snippet}

<div class="min-h-dvh">
  <Page class="bg-background text-foreground">
  <PageContent class="px-8">
    <div class="sticky top-0 z-10 mx-auto max-w-2xl bg-background py-4">
      <TableOfContents
        variant="collapsible"
        headingSelector='[data-fw="svelte"] :is(h2, h3, h4, h5, h6)'
        class="max-w-[22rem]"
      />
    </div>
    <div class="mx-auto flex max-w-2xl flex-col gap-10 pb-10">
      <section class="scroll-mt-24">
        <h2 id="svelte-04-overview" class="text-lg font-semibold">Overview</h2>
        {@render filler(8)}
      </section>
      <section class="scroll-mt-24">
        <h2 id="svelte-04-prerequisites" class="text-lg font-semibold">Prerequisites</h2>
        {@render filler(5)}
      </section>
      <section class="scroll-mt-24">
        <h2 id="svelte-04-quick-start" class="text-lg font-semibold">Quick Start</h2>
        {@render filler(20)}
      </section>
      <section class="scroll-mt-24">
        <h2 id="svelte-04-commands" class="text-lg font-semibold">Core Commands</h2>
        {@render filler(15)}
      </section>
      <section class="scroll-mt-24">
        <h2 id="svelte-04-troubleshooting" class="text-lg font-semibold">Troubleshooting</h2>
        {@render filler(12)}
      </section>
    </div>
  </PageContent>
  </Page>
</div>
