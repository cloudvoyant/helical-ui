// apps/docs/src/components/examples/layout/portal/react.tsx
import { Portal } from '@cloudvoyant/helical-react';

export default function ReactLayoutPortal() {
  return (
    <p className="text-sm text-muted-foreground">
      This text renders in place.{' '}
      <Portal>
        <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
          This badge renders at document.body via Portal
        </span>
      </Portal>
    </p>
  );
}
