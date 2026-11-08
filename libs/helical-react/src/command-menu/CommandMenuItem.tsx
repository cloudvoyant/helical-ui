// libs/helical-react/src/command-menu/CommandMenuItem.tsx

// 1. Imports
import { Highlight } from '@ark-ui/react/highlight';
import { Check, ChevronRight } from 'lucide-react';
import {
  commandMenuItemVariants,
  splitHighlightSegments,
  type CommandFlatItem,
} from '@cloudvoyant/helical-ui';
import { Kbd } from '../kbd';
import { ListboxItem, ListboxItemText } from '../listbox';
import { Row } from '../row';
import { useCommandMenuContext } from './context';

// 2. Module constants & types
export interface CommandMenuItemProps {
  item: CommandFlatItem;
}

export type ColonCommandItemProps = CommandMenuItemProps;

const HIGHLIGHT_MARK_CLASS =
  'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

// 3. Local helpers
function renderFuzzyText(
  text: string,
  query: string,
  matchPositions?: number[],
) {
  if (matchPositions && matchPositions.length > 0) {
    const segments = splitHighlightSegments(text, matchPositions);
    return (
      <>
        {segments.map((seg, idx) =>
          seg.highlight ? (
            <mark key={idx} className={HIGHLIGHT_MARK_CLASS}>
              {seg.text}
            </mark>
          ) : (
            <span key={idx}>{seg.text}</span>
          ),
        )}
      </>
    );
  }
  if (query.trim().length > 0) {
    return (
      <Highlight
        text={text}
        query={query.trim()}
        ignoreCase
        matchAll
        className={HIGHLIGHT_MARK_CLASS}
      />
    );
  }
  return <>{text}</>;
}

// 4. Exported component
export function CommandMenuItem({ item }: CommandMenuItemProps) {
  // --- State ---
  const {
    resolution,
    effectiveHighlightedValue,
    size,
    showShortcuts,
    executeOrDrillItem,
  } = useCommandMenuContext();

  const isHighlighted = effectiveHighlightedValue === item.value;

  // --- Render ---
  return (
    <ListboxItem
      item={{
        value: item.value,
        label: item.command,
        disabled: item.disabled,
      }}
      data-testid="command-menu-item"
      data-command-value={item.node.value}
      data-command-token={item.command}
      data-command-branch={item.isBranch ? 'true' : 'false'}
      data-command-active={item.active ? 'true' : undefined}
      data-highlighted={isHighlighted ? '' : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        executeOrDrillItem(item);
      }}
      className={commandMenuItemVariants({ size })}
    >
      <ListboxItemText className="min-w-0 flex-1 truncate">
        <Row className="min-w-0 items-center gap-2">
          <span className="truncate font-mono font-medium text-foreground group-data-[highlighted]:text-accent-foreground">
            {renderFuzzyText(
              item.command,
              resolution.partialToken,
              item.commandMatchPositions,
            )}
          </span>
          {item.active && (
            <Check
              className="size-3.5 shrink-0 text-primary"
              aria-label="Active"
            />
          )}
        </Row>
      </ListboxItemText>
      {(Boolean(showShortcuts && item.shortcut) || item.isBranch) && (
        <Row className="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          {showShortcuts && item.shortcut ? <Kbd size="sm" hotkey={item.shortcut} /> : null}
          {item.isBranch && (
            <ChevronRight
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </Row>
      )}
    </ListboxItem>
  );
}

export const ColonCommandItem = CommandMenuItem;
