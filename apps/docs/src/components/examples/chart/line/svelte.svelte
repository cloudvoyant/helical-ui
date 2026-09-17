<!-- apps/docs/src/components/examples/chart/line/svelte.svelte -->
<script lang="ts">
  import { Chart } from '@cloudvoyant/helical-svelte';

  const data = [
    { name: 'Jan', sales: 400, costs: 240 },
    { name: 'Feb', sales: 300, costs: 139 },
    { name: 'Mar', sales: 500, costs: 280 },
  ];
</script>

<Chart
  type="line"
  {data}
  series={[
    { key: 'sales', label: 'Sales' },
    { key: 'costs', label: 'Costs' },
  ]}
  xKey="name"
/>
