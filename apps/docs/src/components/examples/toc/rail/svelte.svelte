<!-- apps/docs/src/components/examples/toc/rail/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Rail" example — the depth rail, bezier turns, and
     per-item SVG geometry live in the high-level component, not here. -->
<script lang="ts">
  import { Page, PageContent, PageGutter } from '@cloudvoyant/helical-svelte';
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
  <PageContent class="px-8 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      <section class="scroll-mt-8">
        <h2 id="svelte-07-overview" class="text-lg font-semibold">Overview</h2>
        {@render filler(10)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-07-installation" class="text-lg font-semibold">Installation</h2>
        {@render filler(8)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-07-package-manager" class="text-base font-semibold">Package Manager</h3>
        {@render filler(12)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-07-peer-dependencies" class="text-base font-semibold">Peer Dependencies</h3>
        {@render filler(6)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-07-usage" class="text-lg font-semibold">Usage</h2>
        {@render filler(14)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-07-server-components" class="text-base font-semibold">Server Components</h3>
        {@render filler(9)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h3 id="svelte-07-styling" class="text-base font-semibold">Styling</h3>
        {@render filler(11)}
      </section>
      <section class="scroll-mt-8 ps-6">
        <h4 id="svelte-07-theming" class="text-base font-semibold">Theming</h4>
        {@render filler(7)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-07-api-reference" class="text-lg font-semibold">API Reference</h2>
        {@render filler(12)}
      </section>
    </div>
  </PageContent>
  <PageGutter side="right" class="border-s border-border">
    <TableOfContents
      variant="rail"
      headingSelector='[data-fw="svelte"] :is(h2, h3, h4, h5, h6)'
    />
  </PageGutter>
  </Page>
</div>
