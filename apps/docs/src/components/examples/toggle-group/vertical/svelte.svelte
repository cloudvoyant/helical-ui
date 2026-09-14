<!-- apps/docs/src/components/examples/toggle-group/vertical/svelte.svelte -->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-svelte';
</script>

<ToggleGroup orientation="vertical" defaultValue={['a']}>
  <ToggleGroupItem value="a">Option A</ToggleGroupItem>
  <ToggleGroupItem value="b">Option B</ToggleGroupItem>
  <ToggleGroupItem value="c">Option C</ToggleGroupItem>
</ToggleGroup>
