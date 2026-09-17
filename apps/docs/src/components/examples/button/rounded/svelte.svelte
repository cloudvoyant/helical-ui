<!-- apps/docs/src/components/examples/button/rounded/svelte.svelte -->
<script lang="ts">
  import { Button } from '@cloudvoyant/helical-svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
  <Button color="primary" class="rounded-full">Primary</Button>
  <Button color="secondary" class="rounded-full">Secondary</Button>
  <Button color="success" class="rounded-full">Success</Button>
  <Button color="danger" class="rounded-full">Danger</Button>
  <Button color="warn" class="rounded-full">Warn</Button>
  <Button color="info" class="rounded-full">Info</Button>
</div>
