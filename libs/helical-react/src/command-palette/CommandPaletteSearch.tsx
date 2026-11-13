// 1. Imports
import { Search } from 'lucide-react';
import { cn, commandPaletteStyles } from '@cloudvoyant/helical-ui';
import { Kbd } from '../kbd';
import { ListboxInput } from '../listbox';
import { Row } from '../row';
import { useCommandPaletteContext } from './context';

// 2. Module constants & types
export interface CommandPaletteSearchProps {
  placeholder?: string;
  className?: string;
}

// 4. Exported functions / components
/**
 * Renders the search input, submenu breadcrumbs, and modal close shortcut for `CommandPalette`.
 */
export function CommandPaletteSearch({
  placeholder: placeholderProp,
  className,
}: CommandPaletteSearchProps = {}) {
  // --- State ---
  const {
    resolution,
    currentActivePath,
    currentQuery,
    inline,
    placeholder,
    setActivePath,
    setQuery,
    handleOpenChange,
    focusInput,
    handleInputKeyDown,
  } = useCommandPaletteContext();

  const basePlaceholder = placeholderProp ?? placeholder;
  const activePlaceholder =
    resolution.breadcrumbs.length > 0
      ? `${resolution.breadcrumbs[resolution.breadcrumbs.length - 1]!.label}...`
      : basePlaceholder;

  // --- Render ---
  return (
    <div className={cn(commandPaletteStyles.header, className)}>
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      {resolution.breadcrumbs.length > 0 && (
        <Row className="shrink-0 items-center gap-1" data-testid="command-palette-breadcrumbs">
          <button
            type="button"
            tabIndex={-1}
            data-testid="command-palette-breadcrumb-root"
            onClick={() => {
              setActivePath([]);
              setQuery('');
              focusInput();
            }}
            className={commandPaletteStyles.breadcrumb}
          >
            Commands
          </button>
          {resolution.breadcrumbs.map((crumb, idx) => (
            <button
              key={crumb.value}
              type="button"
              tabIndex={-1}
              data-testid="command-palette-breadcrumb"
              data-breadcrumb-value={crumb.value}
              onClick={() => {
                setActivePath(currentActivePath.slice(0, idx + 1));
                setQuery('');
                focusInput();
              }}
              className={commandPaletteStyles.breadcrumb}
            >
              <span>›</span>
              <span>{crumb.label}</span>
            </button>
          ))}
        </Row>
      )}
      <ListboxInput
        autoFocus={!inline}
        autoHighlight
        data-testid="command-palette-input"
        placeholder={activePlaceholder}
        value={currentQuery}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onKeyDownCapture={handleInputKeyDown}
        className={commandPaletteStyles.input}
      />
      {!inline && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close command palette"
          onClick={() => handleOpenChange(false)}
          className="shrink-0 opacity-80 transition-opacity hover:opacity-100"
        >
          <Kbd size="sm">Esc</Kbd>
        </button>
      )}
    </div>
  );
}
