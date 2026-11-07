// apps/docs/src/components/examples/colon-command/default/react.tsx

// 1. Imports
import { useEffect, useMemo, useState } from 'react';
import { Button, ColonCommand, Kbd, useToast, type CommandSelectContext } from '@cloudvoyant/helical-react';
import { buildDocsCommandTree, subscribeDocsCommandState } from '../../../../lib/commands';

// 2. Exported component
export default function ReactColonCommandDefault() {
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
      title: `Executed ${ctx.commandString}`,
      description: ctx.node.label,
      type: ctx.node.badge === 'Future' ? 'info' : 'success',
    });
  };

  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" data-testid="cc-default-open" onClick={() => setOpen(true)}>
        Open Command Menu <Kbd size="sm">:</Kbd>
      </Button>
      <ColonCommand items={items} open={open} onOpenChange={setOpen} onSelectCommand={handleSelectCommand} />
    </div>
  );
}
