// libs/helical-react/src/command-menu/CommandMenuPromptBar.tsx

// 1. Imports
import { CornerDownLeft } from 'lucide-react';
import { cn, commandMenuStyles } from '@cloudvoyant/helical-ui';
import { Kbd } from '../kbd';
import { ListboxInput } from '../listbox';
import { Row } from '../row';
import { useCommandMenuContext } from './context';

// 2. Module constants & types
export interface CommandMenuPromptBarProps {
  className?: string;
}

export type ColonCommandPromptBarProps = CommandMenuPromptBarProps;

// 4. Exported component
/**
 * Renders the `:` prompt input and keyboard hint bar for `CommandMenu`.
 */
export function CommandMenuPromptBar({ className }: CommandMenuPromptBarProps = {}) {
  // --- State ---
  const {
    currentInput,
    size,
    inline,
    placeholder,
    setInputValue,
    handleOpenChange,
    handleInputKeyDown,
  } = useCommandMenuContext();

  // --- Render ---
  return (
    <div className={cn(commandMenuStyles.promptBar({ size }), className)}>
      <span
        data-testid="command-menu-prefix"
        className={commandMenuStyles.prefix}
      >
        :
      </span>
      <ListboxInput
        autoFocus={!inline}
        autoHighlight
        data-testid="command-menu-input"
        placeholder={placeholder}
        value={currentInput.replace(/^:/, '')}
        onChange={(e) => setInputValue(e.currentTarget.value, null)}
        onKeyDownCapture={handleInputKeyDown}
        className={commandMenuStyles.input({ size })}
      />
      <Row className="shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="hidden items-center gap-1 sm:inline-flex">
          <Kbd size="sm">Tab</Kbd>
          <span>Next</span>
        </span>
        <span className="hidden items-center gap-1 sm:inline-flex">
          <Kbd size="sm">
            <CornerDownLeft className="size-3" />
          </Kbd>
          <span>Run</span>
        </span>
        {!inline && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close command menu"
            onClick={() => handleOpenChange(false)}
            className="opacity-80 transition-opacity hover:opacity-100"
          >
            <Kbd size="sm">Esc</Kbd>
          </button>
        )}
      </Row>
    </div>
  );
}

export const ColonCommandPromptBar = CommandMenuPromptBar;
