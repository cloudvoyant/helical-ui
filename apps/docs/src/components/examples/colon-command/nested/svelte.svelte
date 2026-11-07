<!-- apps/docs/src/components/examples/colon-command/nested/svelte.svelte -->
<script lang="ts">
  import { type CommandNode } from '@cloudvoyant/helical-ui';
  import {
    Badge,
    Button,
    ColonCommand,
    HStack,
    Kbd,
    VStack,
  } from '@cloudvoyant/helical-svelte';

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

  let open = $state(false);
  let executed = $state('None');
</script>

<VStack class="w-full gap-3 rounded-lg border border-border bg-card p-4">
  <HStack class="flex-wrap items-center justify-between gap-2">
    <HStack class="items-center gap-2">
      <span class="text-xs font-medium text-muted-foreground">Executed:</span>
      <Badge variant="subtle" color="secondary" data-testid="cc-nested-selected">
        {executed}
      </Badge>
    </HStack>
    <Button
      size="sm"
      variant="outline"
      data-testid="cc-nested-open"
      onclick={() => {
        open = true;
      }}
    >
      Open Nested :Command
    </Button>
  </HStack>
  <p class="text-xs text-muted-foreground">
    Supports aliases (<code class="font-mono text-foreground">:ws g status</code>,
    <code class="font-mono text-foreground">:w</code>), multi-level <Kbd size="sm">Tab</Kbd>
    completion, and inline error diagnostics when an unrecognized command is submitted.
  </p>
  <ColonCommand
    items={NESTED_COLON_TREE}
    bind:open
    onSelectCommand={(ctx) => {
      executed = ctx.commandString;
    }}
  />
</VStack>
