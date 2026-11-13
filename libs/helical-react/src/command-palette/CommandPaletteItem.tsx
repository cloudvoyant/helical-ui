// 1. Imports
import { Highlight } from '@ark-ui/react/highlight';
import { Check, ChevronRight } from 'lucide-react';
import { cn, commandPaletteStyles, type CommandFlatItem } from '@cloudvoyant/helical-ui';
import { splitHighlightSegments } from '@cloudvoyant/helical-ui/commands';
import { Badge } from '../badge';
import { Kbd } from '../kbd';
import { ListboxItem, ListboxItemText } from '../listbox';
import { Row } from '../row';
import { useCommandPaletteContext } from './context';

// 2. Module constants & types
export interface CommandPaletteItemProps {
  item: CommandFlatItem;
  className?: string;
}

const HIGHLIGHT_MARK_CLASS =
  'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

// 3. Local helpers / hooks
function renderHighlightedLabel(
  label: string,
  query: string,
  matchPositions?: number[],
) {
  if (matchPositions && matchPositions.length > 0) {
    const segments = splitHighlightSegments(label, matchPositions);
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
        text={label}
        query={query.trim()}
        ignoreCase
        matchAll
        className={HIGHLIGHT_MARK_CLASS}
      />
    );
  }
  return <>{label}</>;
}

// 4. Exported functions / components
/**
 * Renders a selectable command row inside `CommandPaletteResults`.
 */
export function CommandPaletteItem({ item, className }: CommandPaletteItemProps) {
  // --- State ---
  const {
    effectiveHighlightedValue,
    currentActivePath,
    currentQuery,
    selectFlatItem,
  } = useCommandPaletteContext();

  // --- Render ---
  return (
    <ListboxItem
      item={{
        value: item.value,
        label: item.label,
        disabled: item.disabled,
      }}
      data-testid="command-palette-item"
      data-command-value={item.node.value}
      data-command-branch={item.isBranch ? 'true' : 'false'}
      data-command-active={item.active ? 'true' : undefined}
      data-highlighted={effectiveHighlightedValue === item.value ? '' : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        selectFlatItem(item);
      }}
      className={cn(commandPaletteStyles.item, className)}
    >
      <ListboxItemText className="min-w-0 flex-1 truncate font-medium text-foreground">
        <Row className="min-w-0 items-center gap-2">
          {currentQuery.trim().length > 0 &&
            item.breadcrumbLabels.length > 0 &&
            currentActivePath.length === 0 && (
              <span
                data-testid="command-palette-item-path"
                className="shrink-0 text-xs text-muted-foreground"
              >
                {item.breadcrumbLabels.join(' › ')} ›
              </span>
            )}
          <span className="truncate">
            {renderHighlightedLabel(
              item.label,
              currentQuery,
              item.matchPositions,
            )}
          </span>
          {item.badge && (
            <Badge
              variant="outline"
              size="sm"
              data-testid="command-palette-item-badge"
            >
              {item.badge}
            </Badge>
          )}
          {item.active && (
            <Check
              className="size-3.5 shrink-0 text-primary"
              aria-label="Active"
            />
          )}
        </Row>
      </ListboxItemText>
      <Row className="shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
        {item.shortcut && <Kbd size="sm" hotkey={item.shortcut} />}
        {item.isBranch && (
          <ChevronRight
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </Row>
    </ListboxItem>
  );
}
