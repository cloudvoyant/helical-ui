// apps/docs/src/components/examples/command-palette/default/react.tsx

// 1. Imports
import { useEffect, useMemo, useState } from 'react';
import { Button, CommandPalette, Kbd, useToast, type CommandSelectContext } from '@cloudvoyant/helical-react';
import { buildDocsCommandTree, subscribeDocsCommandState } from '../../../../lib/commands';

// 2. Exported component
export default function ReactCommandPaletteDefault() {
  // --- State ---
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [revision, setRevision] = useState(0);
  const items = useMemo(() => buildDocsCommandTree(), [revision]);

  // --- Effects ---
  useEffect(() => subscribeDocsCommandState(() => setRevision((r) => r + 1)), []);

  // --- Methods ---
  const handleSelectCommand = (ctx: CommandSelectContext) => {
    toast.create({
      title: ctx.node.label,
      description:
        ctx.node.badge === 'Future'
          ? 'Full-text documentation search is coming soon.'
          : `Executed ${ctx.valuePath.join(' › ')}`,
      type: ctx.node.badge === 'Future' ? 'info' : 'success',
    });
  };

  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" data-testid="cp-default-open" onClick={() => setOpen(true)}>
        Open Command Palette <Kbd size="sm">⌘K</Kbd>
      </Button>
      <CommandPalette items={items} open={open} onOpenChange={setOpen} onSelectCommand={handleSelectCommand} />
    </div>
  );
}
