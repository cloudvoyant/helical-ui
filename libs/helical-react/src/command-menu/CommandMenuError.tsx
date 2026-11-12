// libs/helical-react/src/command-menu/CommandMenuError.tsx

// 1. Imports
import { AlertCircle } from 'lucide-react';
import { cn, commandMenuStyles } from '@cloudvoyant/helical-ui';
import { Row } from '../row';
import { useCommandMenuContext } from './context';

// 2. Module constants & types
export interface CommandMenuErrorProps {
  className?: string;
}

export type ColonCommandErrorProps = CommandMenuErrorProps;

// 4. Exported component
export function CommandMenuError({ className }: CommandMenuErrorProps = {}) {
  // --- State ---
  const { activeError, resolution } = useCommandMenuContext();

  // --- Render ---
  if (!activeError || !resolution.hasCommands) {
    return null;
  }

  return (
    <div
      role="alert"
      data-testid="command-menu-error"
      className={cn(commandMenuStyles.error, className)}
    >
      <Row className="items-center gap-1.5">
        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
        <span>{activeError}</span>
      </Row>
    </div>
  );
}

export const ColonCommandError = CommandMenuError;
