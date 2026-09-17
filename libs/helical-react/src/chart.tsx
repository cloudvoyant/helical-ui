// libs/helical-react/src/chart.tsx
// Closely based on: diffbook Chart (packages/diffbook-ui/src/components/Chart.impl.tsx),
// rebuilt on TanStack Charts: the definition is shared with the Svelte adapter.
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { Chart as TanStackChart } from '@tanstack/charts/react';
import { chartRootBase, buildChartDefinition, cn } from '@cloudvoyant/helical-ui';
import type { ChartProps as ChartPropsBase } from '@cloudvoyant/helical-ui';

export type ChartProps = HTMLArkProps<'div'> &
  ChartPropsBase & {
    /** Pre-rendered SVG markup (server/static path). When provided the component renders it
     *  immediately and never mounts the client adapter. */
    svg?: string;
  };

export function Chart({ svg, className, ...props }: ChartProps) {
  const { type, height = 320 } = props;

  if (svg !== undefined) {
    return (
      <ark.div data-chart-state="prerendered" data-chart-type={type} className={cn(chartRootBase, className)}>
        <div className="flex w-full justify-center [&>svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      </ark.div>
    );
  }

  // Client render: build the shared definition and hand it to the TanStack React adapter.
  const definition = buildChartDefinition(props);

  return (
    <ark.div data-chart-state="ready" data-chart-type={type} className={cn(chartRootBase, className)}>
      <TanStackChart definition={definition} height={height} ariaLabel={type === 'pie' ? 'Pie chart' : 'Chart'} />
    </ark.div>
  );
}
