<!-- apps/docs/src/components/examples/page/default/svelte.svelte -->
<script lang="ts">
  import { Page, PageContent, PageFooter } from '@cloudvoyant/helical-svelte';
</script>

<Page>
  <PageContent class="flex items-center justify-center">
    <div class="p-8 text-center">
      <h1 class="text-xl font-semibold">Page content</h1>
      <p class="mt-2 text-sm text-muted-foreground">The page body is at least one viewport tall.</p>
    </div>
  </PageContent>
  <PageFooter class="border-t border-border bg-muted/40">
    <p class="px-4 py-3 text-sm text-muted-foreground">Footer</p>
  </PageFooter>
</Page>
