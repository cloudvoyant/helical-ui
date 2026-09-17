<!-- apps/docs/src/components/examples/page/gutters/svelte.svelte -->
<script lang="ts">
  import { Page, PageGutter, PageContent, PageFooter, Col } from '@cloudvoyant/helical-svelte';
</script>

<Page>
  <PageGutter side="left">
    <Col class="w-full gap-2 border-r border-border bg-muted/40 p-3">
      <p class="text-xs font-semibold text-muted-foreground">Left gutter</p>
      <p class="text-sm">Sticky, non-scrolling.</p>
    </Col>
  </PageGutter>
  <PageContent class="flex items-center justify-center">
    <div class="p-8 text-center">
      <h1 class="text-xl font-semibold">Center content</h1>
      <p class="mt-2 text-sm text-muted-foreground">Scroll down — the gutters stay fixed until the footer appears.</p>
      <div class="mx-auto mt-8 max-w-md space-y-4 text-left text-sm text-muted-foreground">
        {#each Array.from({ length: 20 }) as _, i (i)}
          <p>Paragraph {i + 1} — enough content to make the page body taller than the viewport, so the sticky gutters stay pinned while the center column scrolls.</p>
        {/each}
      </div>
    </div>
  </PageContent>
  <PageGutter side="right" align="center">
    <Col class="w-full gap-2 border-l border-border bg-muted/40 p-3">
      <p class="text-xs font-semibold text-muted-foreground">Right gutter</p>
      <p class="text-sm">Aligned center.</p>
    </Col>
  </PageGutter>
  <PageFooter class="border-t border-border bg-muted/40">
    <p class="px-4 py-3 text-sm text-muted-foreground">Footer</p>
  </PageFooter>
</Page>
