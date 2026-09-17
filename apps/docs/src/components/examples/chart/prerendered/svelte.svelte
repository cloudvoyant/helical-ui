<!-- apps/docs/src/components/examples/chart/prerendered/svelte.svelte -->
<script lang="ts">
  import { Chart } from '@cloudvoyant/helical-svelte';
  import { renderChartSvgString } from '@cloudvoyant/helical-ui';

  const data = [
    { name: 'React', value: 40 },
    { name: 'Svelte', value: 30 },
    { name: 'Vue', value: 30 },
  ];

  const svg = renderChartSvgString({ type: 'pie', data, series: [{ key: 'value' }], nameKey: 'name' }, { width: 640, height: 360, ariaLabel: 'Prerendered pie chart' });
</script>

<Chart type="pie" {data} series={[{ key: 'value' }]} nameKey="name" {svg} />
