<!-- apps/docs/src/components/examples/toggle-group/attached/svelte.svelte -->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-svelte';
  import { AlignLeft, AlignCenter, AlignRight } from 'lucide-svelte';
</script>

<ToggleGroup attached defaultValue={['left']}>
  <ToggleGroupItem value="left" variant="outline" aria-label="Align left"><AlignLeft /></ToggleGroupItem>
  <ToggleGroupItem value="center" variant="outline" aria-label="Align center"><AlignCenter /></ToggleGroupItem>
  <ToggleGroupItem value="right" variant="outline" aria-label="Align right"><AlignRight /></ToggleGroupItem>
</ToggleGroup>
