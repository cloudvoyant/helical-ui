<!-- apps/docs/src/components/examples/toc/indicator/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Indicator" example — the sliding marker follows the
     active item via the machine's indicator props. -->
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
        <h2 id="svelte-06-step-validation" class="text-lg font-semibold">Validation Pending</h2>
        {@render filler(5)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-06-upload-progress" class="text-lg font-semibold">Asset Uploading</h2>
        {@render filler(90)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-06-deployment-sync" class="text-lg font-semibold">Server Sync Active</h2>
        {@render filler(12)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-06-build-pipeline" class="text-lg font-semibold">CI/CD Running</h2>
        {@render filler(105)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-06-database-health" class="text-lg font-semibold">DB Connection Stable</h2>
        {@render filler(3)}
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-06-final-draft" class="text-lg font-semibold">Final Draft</h2>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-06-final-review" class="text-lg font-semibold">Final Review</h2>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-06-publish" class="text-lg font-semibold">Publish</h2>
      </section>
    </div>
  </PageContent>
  <PageGutter side="right" class="border-s border-border">
    <TableOfContents
      variant="indicator"
      headingSelector='[data-fw="svelte"] :is(h2, h3, h4, h5, h6)'
    />
  </PageGutter>
  </Page>
</div>
