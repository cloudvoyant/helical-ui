// apps/docs/src/components/examples/card/horizontal/react.tsx
import { Card, CardHeader, CardBody, CardTitle, CardDescription, CardCover } from '@cloudvoyant/helical-react';
import { User } from 'lucide-react';

export default function ReactCardHorizontal() {
  return (
    <Card orientation="horizontal" className="w-full max-w-2xl">
      <CardCover className="w-1/3">
        <div className="flex h-full min-h-40 w-full items-center justify-center bg-gradient-to-br from-primary/40 to-accent/50">
          <User className="size-8 text-primary" />
        </div>
      </CardCover>
      <div className="flex flex-1 flex-col gap-4">
        <CardHeader>
          <CardTitle>Horizontal card</CardTitle>
          <CardDescription>The cover bleeds to the left, top, and bottom edges.</CardDescription>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted-foreground">
            Use orientation="horizontal" with a flush cover and wrap the content in a flex column.
          </p>
        </CardBody>
      </div>
    </Card>
  );
}
