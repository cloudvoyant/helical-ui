// libs/helical-react/src/colon-command/ColonCommandPromptBar.tsx

// 1. Imports
import { CornerDownLeft } from 'lucide-react';
import {
  cn,
  colonCommandInputVariants,
  colonCommandPrefixBase,
  colonCommandPromptBarVariants,
} from '@cloudvoyant/helical-ui';
import { Kbd } from '../kbd';
import { ListboxInput } from '../listbox';
import { Row } from '../row';
import { useColonCommandContext } from './context';

// 2. Module constants & types
export interface ColonCommandPromptBarProps {
  className?: string;
}

// 4. Exported component
export function ColonCommandPromptBar({ className }: ColonCommandPromptBarProps = {}) {
  // --- State ---
  const {
    currentInput,
    size,
    inline,
    placeholder,
    setInputValue,
    handleOpenChange,
    handleInputKeyDown,
  } = useColonCommandContext();

  // --- Render ---
  return (
    <div className={cn(colonCommandPromptBarVariants({ size }), className)}>
      <span
        data-testid="colon-command-prefix"
        className={colonCommandPrefixBase}
      >
        :
      </span>
      <ListboxInput
        autoFocus={!inline}
        autoHighlight
        data-testid="colon-command-input"
        placeholder={placeholder}
        value={currentInput}
        onChange={(e) => setInputValue(e.currentTarget.value, null)}
        onKeyDownCapture={handleInputKeyDown}
        className={colonCommandInputVariants({ size })}
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
            aria-label="Close colon command menu"
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
