// apps/docs/src/components/examples/card/default/react.tsx
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription, Button } from '@cloudvoyant/helical-react';

export default function ReactCardDefault() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Manage your team and their roles.</CardDescription>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted-foreground">
          This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="solid" color="primary" size="sm">
          Add member
        </Button>
        <Button variant="outline" color="primary" size="sm">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
