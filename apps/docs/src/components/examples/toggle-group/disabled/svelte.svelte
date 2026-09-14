<!-- apps/docs/src/components/examples/toggle-group/disabled/svelte.svelte -->
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@cloudvoyant/vortex-svelte';
</script>

<ToggleGroup defaultValue={['a']} disabled>
  <ToggleGroupItem value="a">Option A</ToggleGroupItem>
  <ToggleGroupItem value="b">Option B</ToggleGroupItem>
  <ToggleGroupItem value="c">Option C</ToggleGroupItem>
</ToggleGroup>
