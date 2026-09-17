<!-- apps/docs/src/components/examples/chart/pie/svelte.svelte -->
<script lang="ts">
  import { Chart } from '@cloudvoyant/helical-svelte';

  const data = [
    { name: 'React', value: 40 },
    { name: 'Svelte', value: 30 },
    { name: 'Vue', value: 30 },
  ];
</script>

<Chart type="pie" {data} series={[{ key: 'value' }]} nameKey="name" />
