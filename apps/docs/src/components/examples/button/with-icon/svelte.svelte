<!-- apps/docs/src/components/examples/button/with-icon/svelte.svelte -->
<script lang="ts">
  import { Button } from '@cloudvoyant/helical-svelte';
  import { Check, Trash2, AlertTriangle, Info, Plus, Download } from 'lucide-svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
  <Button color="success"><Check class="size-4" />Approve</Button>
  <Button color="danger"><Trash2 class="size-4" />Delete</Button>
  <Button color="warn"><AlertTriangle class="size-4" />Warn</Button>
  <Button color="info"><Info class="size-4" />Info</Button>
  <Button><Plus class="size-4" />Add</Button>
  <Button color="secondary"><Download class="size-4" />Export</Button>
</div>
