<!-- apps/docs/src/components/examples/notice/variants/svelte.svelte -->
<script lang="ts">
  import { Notice } from '@cloudvoyant/helical-svelte';
</script>

<div class="flex flex-col gap-2">
  <Notice variant="info" title="Heads up">An informative notice with a title and body.</Notice>
  <Notice variant="success" title="Deployed">The build succeeded.</Notice>
  <Notice variant="warning">No title — just a warning body.</Notice>
  <Notice variant="error" title="Build failed">Check the logs for details.</Notice>
</div>
