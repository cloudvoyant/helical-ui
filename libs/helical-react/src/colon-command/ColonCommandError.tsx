// libs/helical-react/src/colon-command/ColonCommandError.tsx

// 1. Imports
import { AlertCircle } from 'lucide-react';
import { cn, colonCommandErrorBase } from '@cloudvoyant/helical-ui';
import { Row } from '../row';
import { useColonCommandContext } from './context';

// 2. Module constants & types
export interface ColonCommandErrorProps {
  className?: string;
}

// 4. Exported component
export function ColonCommandError({ className }: ColonCommandErrorProps = {}) {
  // --- State ---
  const { activeError, resolution } = useColonCommandContext();

  // --- Render ---
  if (!activeError || !resolution.hasCommands) {
    return null;
  }

  return (
    <div
      role="alert"
      data-testid="colon-command-error"
      className={cn(colonCommandErrorBase, className)}
    >
      <Row className="items-center gap-1.5">
        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
        <span>{activeError}</span>
      </Row>
    </div>
  );
}
