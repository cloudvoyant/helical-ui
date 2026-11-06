// apps/docs/src/components/examples/colon-command/placements/react.tsx
import { useMemo, useState } from 'react';
import { type ColonCommandColumns } from '@cloudvoyant/helical-ui';
import { Badge, Button, ColonCommand, HStack, VStack } from '@cloudvoyant/helical-react';
import { buildDocsCommandTree } from '../../../../lib/commands';

export default function ReactColonCommandPlacements() {
  const [placement, setPlacement] = useState<'bottom' | 'center' | 'top'>('bottom');
  const [columns, setColumns] = useState<ColonCommandColumns>('auto');
  const [emptyTree, setEmptyTree] = useState(false);
  const [selected, setSelected] = useState('None');

  const docsItems = useMemo(() => buildDocsCommandTree(), []);
  const items = emptyTree ? [] : docsItems;

  return (
    <VStack className="w-full gap-3">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="flex-wrap items-center gap-1.5">
          {(['bottom', 'center', 'top'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={placement === p ? 'solid' : 'outline'}
              data-testid={`cc-placement-${p}`}
              onClick={() => setPlacement(p)}
            >
              {p}
            </Button>
          ))}
          {(['auto', 1, 2, 3, 4] as const).map((col) => (
            <Button
              key={String(col)}
              size="sm"
              variant={columns === col ? 'solid' : 'outline'}
              data-testid={`cc-columns-${col}`}
              onClick={() => setColumns(col)}
            >
              {col === 'auto' ? 'auto cols' : `${col} col`}
            </Button>
          ))}
        </HStack>
        <HStack className="items-center gap-2">
          <Badge variant="subtle" color="primary" data-testid="cc-placements-selected">
            {selected}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            data-testid="cc-placements-toggle-empty"
            onClick={() => setEmptyTree((v) => !v)}
          >
            {emptyTree ? 'Restore Commands' : 'Simulate Empty Commands'}
          </Button>
        </HStack>
      </HStack>
      <ColonCommand
        inline
        placement={placement}
        columns={columns}
        items={items}
        onSelectCommand={(ctx) => {
          setSelected(`${ctx.node.label} (${ctx.commandString})`);
        }}
      />
    </VStack>
  );
}
