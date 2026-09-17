// apps/docs/src/components/examples/chart/line/react.tsx
import { Chart } from '@cloudvoyant/helical-react';

const data = [
  { name: 'Jan', sales: 400, costs: 240 },
  { name: 'Feb', sales: 300, costs: 139 },
  { name: 'Mar', sales: 500, costs: 280 },
];

export default function ReactChartLine() {
  return (
    <Chart
      type="line"
      data={data}
      series={[
        { key: 'sales', label: 'Sales' },
        { key: 'costs', label: 'Costs' },
      ]}
      xKey="name"
    />
  );
}
