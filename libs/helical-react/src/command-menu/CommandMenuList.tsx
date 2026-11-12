// libs/helical-react/src/command-menu/CommandMenuList.tsx

// 1. Imports
import { cn } from '@cloudvoyant/helical-ui';
import {
  commandMenuListVariants,
  resolveCommandMenuGridStyle,
} from '@cloudvoyant/helical-ui/commands';
import { ListboxContent, ListboxEmpty } from '../listbox';
import { Scroll } from '../scroll';
import { CommandMenuItem } from './CommandMenuItem';
import { useCommandMenuContext } from './context';

// 2. Module constants & types
export interface CommandMenuListProps {
  className?: string;
}

export type ColonCommandListProps = CommandMenuListProps;

// 4. Exported component
export function CommandMenuList({ className }: CommandMenuListProps = {}) {
  // --- State ---
  const {
    resolution,
    columns,
    size,
    activeError,
    emptyText,
    noCommandsText,
  } = useCommandMenuContext();

  // --- Render ---
  return (
    <Scroll className="max-h-72 min-h-0 flex-1" viewportClassName="max-h-72">
      <ListboxContent
        tabIndex={-1}
        data-testid="command-menu-list"
        data-columns={String(columns)}
        data-size={size}
        style={resolveCommandMenuGridStyle(columns, resolution.suggestions.length)}
        className={cn(commandMenuListVariants({ columns, size }), className)}
      >
        {!resolution.hasCommands ? (
          <ListboxEmpty
            data-testid="command-menu-empty"
            data-empty-kind="no-commands"
            className="col-span-full"
          >
            {noCommandsText}
          </ListboxEmpty>
        ) : resolution.suggestions.length === 0 ? (
          <ListboxEmpty
            data-testid="command-menu-empty"
            data-empty-kind="no-matches"
            className="col-span-full"
          >
            {activeError ?? emptyText}
          </ListboxEmpty>
        ) : (
          resolution.suggestions.map((item) => (
            <CommandMenuItem key={item.value} item={item} />
          ))
        )}
      </ListboxContent>
    </Scroll>
  );
}

export const ColonCommandList = CommandMenuList;
