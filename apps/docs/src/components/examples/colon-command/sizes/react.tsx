// apps/docs/src/components/examples/colon-command/sizes/react.tsx

// 1. Imports
import { useEffect, useMemo, useState } from 'react';
import { type ColonCommandColumns } from '@cloudvoyant/helical-ui';
import { ColonCommand, HStack, ToggleGroup, ToggleGroupItem, VStack } from '@cloudvoyant/helical-react';
import { buildDocsCommandTree, subscribeDocsCommandState } from '../../../../lib/commands';

// 2. Module constants & types
const SIZES = ['sm', 'md', 'lg'] as const;
const COLUMNS: ColonCommandColumns[] = ['auto', 1, 2, 3, 4];

// 4. Exported component
export default function ReactColonCommandSizes() {
  // --- State ---
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [columns, setColumns] = useState<ColonCommandColumns>('auto');
  const [revision, setRevision] = useState(0);
  const items = useMemo(() => buildDocsCommandTree(), [revision]);

  // --- Effects ---
  useEffect(() => subscribeDocsCommandState(() => setRevision((r) => r + 1)), []);

  // --- Render ---
  return (
    <VStack className="w-full gap-3">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          attached
          value={[size]}
          onValueChange={(d) => {
            const next = d.value[0] as 'sm' | 'md' | 'lg' | undefined;
            if (next) setSize(next);
          }}
          aria-label="Compactness size"
        >
          {SIZES.map((s) => (
            <ToggleGroupItem key={s} value={s} size="sm" variant="outline" data-testid={`cc-size-${s}`}>
              {s === 'sm' ? 'Compact (sm)' : s === 'md' ? 'Default (md)' : 'Comfortable (lg)'}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <ToggleGroup
          attached
          value={[String(columns)]}
          onValueChange={(d) => {
            const raw = d.value[0];
            if (!raw) return;
            setColumns(raw === 'auto' ? 'auto' : (Number(raw) as ColonCommandColumns));
          }}
          aria-label="Completion columns"
        >
          {COLUMNS.map((col) => (
            <ToggleGroupItem
              key={String(col)}
              value={String(col)}
              size="sm"
              variant="outline"
              data-testid={`cc-columns-${col}`}
            >
              {col === 'auto' ? 'auto cols' : `${col} col`}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </HStack>

      <ColonCommand inline size={size} columns={columns} placeholder="Type a command" items={items} />
    </VStack>
  );
}
