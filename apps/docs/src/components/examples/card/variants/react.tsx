// apps/docs/src/components/examples/card/variants/react.tsx
import { Card, CardHeader, CardBody, CardTitle } from '@cloudvoyant/helical-react';

export default function ReactCardVariants() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Outline</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">The default variant with a border and subtle shadow.</p>
        </CardBody>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">No border with a deeper shadow.</p>
        </CardBody>
      </Card>
      <Card variant="subtle">
        <CardHeader>
          <CardTitle>Subtle</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">A muted background with no border.</p>
        </CardBody>
      </Card>
    </div>
  );
}
