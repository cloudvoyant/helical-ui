// apps/docs/src/components/examples/card/override/react.tsx
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@cloudvoyant/helical-react';

export default function ReactCardOverride() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle asChild>
          <h2 className="text-xl">Overridden heading</h2>
        </CardTitle>
        <CardDescription>This title renders as an h2 with a larger size instead of the default h3.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">
          Use asChild to change the heading level, and a text-* class to change the size.
        </p>
      </CardBody>
    </Card>
  );
}
