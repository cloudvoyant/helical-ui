// apps/docs/src/components/examples/command-palette/inline/react.tsx
import { useMemo, useState } from 'react';
import { Badge, Button, CommandPalette, HStack, VStack } from '@cloudvoyant/helical-react';
import { buildDocsCommandTree } from '../../../../lib/commands';

export default function ReactCommandPaletteInline() {
  const [emptyTree, setEmptyTree] = useState(false);
  const [selected, setSelected] = useState('None');

  const docsItems = useMemo(() => buildDocsCommandTree(), []);
  const items = emptyTree ? [] : docsItems;

  return (
    <VStack className="w-full gap-3">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Inline selection:</span>
          <Badge variant="subtle" color="primary" data-testid="cp-inline-selected">
            {selected}
          </Badge>
        </HStack>
        <Button
          size="sm"
          variant="outline"
          data-testid="cp-inline-toggle-empty"
          onClick={() => setEmptyTree((v) => !v)}
        >
          {emptyTree ? 'Restore Commands' : 'Simulate Empty Commands'}
        </Button>
      </HStack>
      <CommandPalette
        inline
        items={items}
        onSelectCommand={(ctx) => {
          setSelected(ctx.node.label);
        }}
      />
    </VStack>
  );
}
