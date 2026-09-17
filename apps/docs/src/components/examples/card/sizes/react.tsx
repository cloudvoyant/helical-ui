// apps/docs/src/components/examples/card/sizes/react.tsx
import { Card, CardHeader, CardBody, CardTitle } from '@cloudvoyant/helical-react';

export default function ReactCardSizes() {
  return (
    <div className="flex flex-col gap-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Card - sm</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">Small card.</p>
        </CardBody>
      </Card>
      <Card size="md">
        <CardHeader>
          <CardTitle>Card - md</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">Medium card.</p>
        </CardBody>
      </Card>
      <Card size="lg">
        <CardHeader>
          <CardTitle>Card - lg</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">Large card.</p>
        </CardBody>
      </Card>
    </div>
  );
}
