// 1. Imports
import { CornerDownLeft } from 'lucide-react';
import { cn, commandPaletteStyles } from '@cloudvoyant/helical-ui';
import { Kbd } from '../kbd';
import { Row } from '../row';
import { useCommandPaletteContext } from './context';

// 2. Module constants & types
export interface CommandPaletteFooterProps {
  className?: string;
}

// 4. Exported functions / components
/**
 * Renders the keyboard navigation hints footer for `CommandPalette`.
 */
export function CommandPaletteFooter({ className }: CommandPaletteFooterProps = {}) {
  // --- State ---
  const { resolution } = useCommandPaletteContext();

  // --- Render ---
  return (
    <div className={cn(commandPaletteStyles.footer, className)}>
      <Row className="items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <Kbd size="sm">↑</Kbd>
          <Kbd size="sm">↓</Kbd>
          <span>Navigate</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd size="sm">
            <CornerDownLeft className="size-3" />
          </Kbd>
          <span>Select</span>
        </span>
        {resolution.breadcrumbs.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <Kbd size="sm">⌫</Kbd>
            <span>Back</span>
          </span>
        )}
      </Row>
      <span className="text-[11px] text-muted-foreground">
        {resolution.breadcrumbs.length > 0
          ? resolution.breadcrumbs.map((b) => b.label).join(' › ')
          : '⌘K'}
      </span>
    </div>
  );
}
