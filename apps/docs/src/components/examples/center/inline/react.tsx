// apps/docs/src/components/examples/center/inline/react.tsx
import { Center } from '@cloudvoyant/helical-react';

export default function ReactCenterInline() {
  return (
    <div className="text-sm">
      Text before
      <Center className="mx-2 inline-flex rounded-md bg-primary/15 px-3 py-1 font-medium">inline</Center>
      text after.
    </div>
  );
}
