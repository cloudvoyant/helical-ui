// apps/docs/src/components/examples/chart/pie/react.tsx
import { Chart } from '@cloudvoyant/helical-react';

const data = [
  { name: 'React', value: 40 },
  { name: 'Svelte', value: 30 },
  { name: 'Vue', value: 30 },
];

export default function ReactChartPie() {
  return <Chart type="pie" data={data} series={[{ key: 'value' }]} nameKey="name" />;
}
