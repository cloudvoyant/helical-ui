<!-- apps/docs/src/components/examples/toggle-group/default/svelte.svelte -->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-svelte';
  import { Bold, Italic, Underline } from 'lucide-svelte';
</script>

<ToggleGroup defaultValue={['bold']}>
  <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
</ToggleGroup>
