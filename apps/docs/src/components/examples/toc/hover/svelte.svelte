<!-- apps/docs/src/components/examples/toc/hover/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Hover" example — collapsed skeleton bars expand to
     links on pointer enter/leave. No pin behavior; upstream has none. -->
<script lang="ts">
  import { Page, PageContent, PageGutter } from '@cloudvoyant/helical-svelte';
  import TableOfContents from '@cloudvoyant/helical-svelte/table-of-contents';
</script>

<div class="min-h-dvh">
  <Page class="bg-background text-foreground">
  <PageContent class="px-8 py-10">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      <section class="scroll-mt-8">
        <h2 id="svelte-05-analytics-dashboard" class="text-lg font-semibold">Real-time Analytics</h2>
        <div class="mt-3 flex flex-col gap-2">
          {#each Array.from({ length: 55 }) as _, i (i)}
            <div class="h-2.5 rounded bg-muted"></div>
          {/each}
        </div>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-05-cloud-storage" class="text-lg font-semibold">S3 Cloud Storage</h2>
        <div class="mt-3 flex flex-col gap-2">
          {#each Array.from({ length: 14 }) as _, i (i)}
            <div class="h-2.5 rounded bg-muted"></div>
          {/each}
        </div>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-05-automation-tools" class="text-lg font-semibold">Workflow Automation</h2>
        <div class="mt-3 flex flex-col gap-2">
          {#each Array.from({ length: 32 }) as _, i (i)}
            <div class="h-2.5 rounded bg-muted"></div>
          {/each}
        </div>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-05-crm-integration" class="text-lg font-semibold">Salesforce Sync</h2>
        <div class="mt-3 flex flex-col gap-2">
          {#each Array.from({ length: 45 }) as _, i (i)}
            <div class="h-2.5 rounded bg-muted"></div>
          {/each}
        </div>
      </section>
      <section class="scroll-mt-8">
        <h2 id="svelte-05-report-generator" class="text-lg font-semibold">Custom PDF Reports</h2>
        <div class="mt-3 flex flex-col gap-2">
          {#each Array.from({ length: 20 }) as _, i (i)}
            <div class="h-2.5 rounded bg-muted"></div>
          {/each}
        </div>
      </section>
    </div>
  </PageContent>
  <PageGutter side="right" align="center" class="border-s border-border">
    <TableOfContents
      variant="hover"
      headingSelector='[data-fw="svelte"] :is(h2, h3, h4, h5, h6)'
    />
  </PageGutter>
  </Page>
</div>
