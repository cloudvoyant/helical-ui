<!-- apps/docs/src/components/examples/chart/bar/svelte.svelte -->
<script lang="ts">
  import { Chart } from '@cloudvoyant/helical-svelte';

  const data = [
    { name: 'Jan', revenue: 42, costs: 20 },
    { name: 'Feb', revenue: 58, costs: 32 },
    { name: 'Mar', revenue: 76, costs: 40 },
    { name: 'Apr', revenue: 64, costs: 28 },
  ];
</script>

<Chart
  type="bar"
  {data}
  series={[
    { key: 'revenue', label: 'Revenue' },
    { key: 'costs', label: 'Costs' },
  ]}
  xKey="name"
/>
