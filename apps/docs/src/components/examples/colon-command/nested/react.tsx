// apps/docs/src/components/examples/colon-command/nested/react.tsx
import { useState } from 'react';
import { type CommandNode } from '@cloudvoyant/helical-ui';
import { Badge, Button, ColonCommand, HStack, Kbd, VStack } from '@cloudvoyant/helical-react';

const NESTED_COLON_TREE: CommandNode[] = [
  {
    value: 'workspace',
    label: 'Workspace Operations',
    command: 'workspace',
    aliases: ['ws'],
    children: [
      {
        value: 'git',
        label: 'Git Commands',
        command: 'git',
        aliases: ['g'],
        children: [
          {
            value: 'checkout-main',
            label: 'Checkout main branch',
            command: 'checkout-main',
          },
          {
            value: 'status',
            label: 'Show working tree status',
            command: 'status',
          },
        ],
      },
      {
        value: 'check',
        label: 'Run Workspace Checks',
        command: 'check',
      },
    ],
  },
  {
    value: 'write',
    label: 'Write Current Buffer',
    command: 'write',
    aliases: ['w'],
  },
  {
    value: 'quit',
    label: 'Close Active Window',
    command: 'quit',
    aliases: ['q'],
  },
];

export default function ReactColonCommandNested() {
  const [open, setOpen] = useState(false);
  const [executed, setExecuted] = useState('None');

  return (
    <VStack className="w-full gap-3 rounded-lg border border-border bg-card p-4">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Executed:</span>
          <Badge variant="subtle" color="secondary" data-testid="cc-nested-selected">
            {executed}
          </Badge>
        </HStack>
        <Button size="sm" variant="outline" data-testid="cc-nested-open" onClick={() => setOpen(true)}>
          Open Nested :Command
        </Button>
      </HStack>
      <p className="text-xs text-muted-foreground">
        Supports aliases (<code className="font-mono text-foreground">:ws g status</code>,{' '}
        <code className="font-mono text-foreground">:w</code>), multi-level <Kbd size="sm">Tab</Kbd> completion, and
        inline error diagnostics when an unrecognized command is submitted.
      </p>
      <ColonCommand
        items={NESTED_COLON_TREE}
        open={open}
        onOpenChange={setOpen}
        onSelectCommand={(ctx) => {
          setExecuted(ctx.commandString);
        }}
      />
    </VStack>
  );
}
