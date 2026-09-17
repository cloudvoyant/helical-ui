// libs/helical-ui/src/chart.ts
// Closely based on: diffbook Chart (packages/diffbook-ui/src/components/Chart.tsx + Chart.impl.tsx),
// rebuilt on TanStack Charts (framework-agnostic definition + React/Svelte adapters + SSR SVG).
import {
  barY,
  areaY,
  colorLegend,
  defineChart,
  lineY,
  createChartRuntime,
  renderChartSvg,
  type DomChartDefinition,
} from '@tanstack/charts';
import { pie, polar, radialArc } from '@tanstack/charts/polar';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal';
import { scalePoint } from '@tanstack/charts/scales/point';
import { tooltip } from '@tanstack/charts/tooltip';

export const chartRootBase = 'not-prose my-4';

export const chartPlaceholderBase = 'flex items-center justify-center rounded-md border border-border bg-muted/40';

export const chartPlaceholderLabelBase = 'text-sm text-muted-foreground';

export interface ChartSeries {
  key: string;
  label?: string;
  color?: string;
}

export interface ChartProps {
  type: 'line' | 'bar' | 'area' | 'pie';
  data: Record<string, string | number>[];
  series: ChartSeries[];
  xKey?: string;
  nameKey?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showAxis?: boolean;
  className?: string;
}

/** Return `var(--chart-N)` cycling through the five chart tokens. */
export function defaultChartColor(index: number): string {
  return `var(--chart-${(index % 5) + 1})`;
}

const COLOR_TOKENS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

/**
 * Build a framework-agnostic TanStack Charts definition from the helical-ui `ChartProps`. The
 * React and Svelte adapters both render this same definition, so the chart is identical
 * across frameworks and can be server-rendered with `renderChartSvgString`.
 *
 * Channels (`x`, `y`, `z`, `color`) are runtime string keys, so they are cast through
 * `as never` at the boundary — TanStack's literal-key typing cannot express dynamic keys.
 */
export function buildChartDefinition(props: ChartProps): DomChartDefinition {
  const {
    type,
    data,
    series,
    xKey = 'name',
    nameKey = 'name',
    showLegend = true,
    showGrid = true,
    showAxis = true,
  } = props;
  const colors = series.map((s, i) => s.color ?? COLOR_TOKENS[i % COLOR_TOKENS.length]);

  if (type === 'pie') {
    const valueKey = series[0]?.key ?? 'value';
    const slices = pie(data as never, { value: valueKey as never });
    // One color per slice — cycle the chart tokens over the data entries (not the series,
    // which is a single `value` key for pie charts).
    const pieColors = data.map((_, i) => series[0]?.color ?? COLOR_TOKENS[i % COLOR_TOKENS.length]);
    const spec = {
      marks: [
        (polar as unknown as (o: Record<string, unknown>) => unknown)({
          scales: { angle: null, radius: null },
          radiusRatio: 0.82,
          marks: [radialArc(slices as never, { color: nameKey as never, key: nameKey as never, cornerRadius: 3 })],
        }),
      ],
      scales: { x: null, y: null },
      color: {
        domain: data.map((d) => String(d[nameKey])),
        range: pieColors,
        legend: showLegend ? colorLegend({}) : undefined,
      },
      tooltip,
    };
    return defineChart(spec as never) as unknown as DomChartDefinition;
  }

  // Fold multiple series into a long-form `{ [xKey], series, value }` so one mark + a
  // color scale renders all series (with a legend keyed by series label).
  const rows = data.flatMap((row) =>
    series.map((s) => ({
      ...row,
      _series: s.label ?? s.key,
      _value: Number(row[s.key]),
    })),
  );

  const markOpts = { x: xKey as never, y: '_value' as never, z: '_series' as never };
  const mark =
    type === 'bar'
      ? barY(rows as never, { ...markOpts, fillOpacity: 0.85 })
      : type === 'area'
        ? areaY(rows as never, { ...markOpts, fillOpacity: 0.15 })
        : lineY(rows as never, { ...markOpts, strokeWidth: 2 });

  const spec = {
    marks: [mark],
    scales: {
      x: { scale: () => scalePoint<string>().padding(0.4), axis: showAxis ? {} : undefined },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: showGrid,
        axis: showAxis ? { ticks: { count: 5 } } : undefined,
      },
    },
    color: {
      scale: () => scaleOrdinal<string, string>().range(colors),
      domain: series.map((s) => s.label ?? s.key),
      legend: showLegend ? colorLegend({}) : undefined,
    },
    tooltip,
  };
  return defineChart(spec as never) as unknown as DomChartDefinition;
}

/** Render a chart to an SVG string on the server (SSR / prerendered path). */
export function renderChartSvgString(
  props: ChartProps,
  opts: { width?: number; height?: number; ariaLabel?: string } = {},
): string {
  const { width = 720, height = props.height ?? 400, ariaLabel = 'Chart' } = opts;
  const definition = buildChartDefinition(props);
  const runtime = createChartRuntime();
  try {
    const scene = runtime.render(definition, { width, height });
    return renderChartSvg(scene, { ariaLabel, idPrefix: 'hx-chart' });
  } finally {
    runtime.destroy();
  }
}
