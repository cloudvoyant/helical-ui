<!-- libs/helical-svelte/src/Chart.svelte -->
<!-- Closely based on: diffbook Chart, rebuilt on TanStack Charts (shared definition with React),
     mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Chart as TanStackChart } from '@tanstack/charts/svelte';
  import { chartRootBase, cn, buildChartDefinition } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    type: 'line' | 'bar' | 'area' | 'pie';
    data: Record<string, string | number>[];
    series: { key: string; label?: string; color?: string }[];
    xKey?: string;
    nameKey?: string;
    height?: number;
    showLegend?: boolean;
    showGrid?: boolean;
    showAxis?: boolean;
    /** Pre-rendered SVG markup (server/static path). */
    svg?: string;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    type,
    data,
    series,
    xKey = 'name',
    nameKey = 'name',
    height = 320,
    showLegend = true,
    showGrid = true,
    showAxis = true,
    svg = undefined,
    class: className = '',
    ...rest
  }: Props = $props();

  const definition = $derived(
    buildChartDefinition({ type, data, series, xKey, nameKey, height, showLegend, showGrid, showAxis }),
  );

  const classes = $derived(cn(chartRootBase, className));
</script>

<div data-chart-state={svg !== undefined ? 'prerendered' : 'ready'} data-chart-type={type} class={classes} {...rest}>
  {#if svg !== undefined}
    <div class="flex w-full justify-center [&>svg]:max-w-full">{@html svg}</div>
  {:else}
    <TanStackChart definition={definition} {height} ariaLabel={type === 'pie' ? 'Pie chart' : 'Chart'} />
  {/if}
</div>
