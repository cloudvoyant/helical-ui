// libs/helical-react/src/colon-command/ColonCommandList.tsx

// 1. Imports
import {
  cn,
  colonCommandListVariants,
  resolveColonCommandGridStyle,
} from '@cloudvoyant/helical-ui';
import { ListboxContent, ListboxEmpty } from '../listbox';
import { Scroll } from '../scroll';
import { ColonCommandItem } from './ColonCommandItem';
import { useColonCommandContext } from './context';

// 2. Module constants & types
export interface ColonCommandListProps {
  className?: string;
}

// 4. Exported component
export function ColonCommandList({ className }: ColonCommandListProps = {}) {
  // --- State ---
  const {
    resolution,
    columns,
    size,
    activeError,
    emptyText,
    noCommandsText,
  } = useColonCommandContext();

  // --- Render ---
  return (
    <Scroll className="max-h-72 min-h-0 flex-1" viewportClassName="max-h-72">
      <ListboxContent
        tabIndex={-1}
        data-testid="colon-command-list"
        data-columns={String(columns)}
        data-size={size}
        style={resolveColonCommandGridStyle(columns, resolution.suggestions.length)}
        className={cn(colonCommandListVariants({ columns, size }), className)}
      >
        {!resolution.hasCommands ? (
          <ListboxEmpty
            data-testid="colon-command-empty"
            data-empty-kind="no-commands"
            className="col-span-full"
          >
            {noCommandsText}
          </ListboxEmpty>
        ) : resolution.suggestions.length === 0 ? (
          <ListboxEmpty
            data-testid="colon-command-empty"
            data-empty-kind="no-matches"
            className="col-span-full"
          >
            {activeError ?? emptyText}
          </ListboxEmpty>
        ) : (
          resolution.suggestions.map((item) => (
            <ColonCommandItem key={item.value} item={item} />
          ))
        )}
      </ListboxContent>
    </Scroll>
  );
}
