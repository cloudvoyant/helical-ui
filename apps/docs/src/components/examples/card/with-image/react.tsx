// apps/docs/src/components/examples/card/with-image/react.tsx
import { Card, CardHeader, CardBody, CardTitle, CardDescription, CardCover } from '@cloudvoyant/helical-react';

export default function ReactCardWithImage() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Card className="w-full max-w-sm">
        <CardCover>
          <div className="h-40 w-full bg-gradient-to-br from-primary/40 to-accent/50" />
        </CardCover>
        <CardHeader>
          <CardTitle>Flush cover</CardTitle>
          <CardDescription>The cover bleeds edge-to-edge.</CardDescription>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">A flush cover reaches the card boundaries.</p>
        </CardBody>
      </Card>
      <Card className="w-full max-w-sm">
        <CardCover variant="inset">
          <div className="h-40 w-full bg-gradient-to-br from-primary/40 to-accent/50" />
        </CardCover>
        <CardHeader>
          <CardTitle>Inset cover</CardTitle>
          <CardDescription>The cover keeps the card padding.</CardDescription>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">An inset cover stays within the padding with rounded corners.</p>
        </CardBody>
      </Card>
    </div>
  );
}
