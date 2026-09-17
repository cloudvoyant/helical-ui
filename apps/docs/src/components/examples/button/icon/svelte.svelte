<!-- apps/docs/src/components/examples/button/icon/svelte.svelte -->
<script lang="ts">
  import { Button } from '@cloudvoyant/helical-svelte';
  import { Plus } from 'lucide-svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
  <Button size="icon" class="rounded-full" aria-label="Add">
    <Plus class="size-4" />
  </Button>
  <Button size="icon" variant="outline" aria-label="Add">
    <Plus class="size-4" />
  </Button>
</div>
