<!-- apps/docs/src/components/examples/command-palette/nested/svelte.svelte -->
<script lang="ts">
  import { type CommandNode } from '@cloudvoyant/helical-ui';
  import {
    Badge,
    Button,
    CommandPalette,
    HStack,
    Kbd,
    VStack,
  } from '@cloudvoyant/helical-svelte';

  const NESTED_TREE: CommandNode[] = [
    {
      value: 'workspace',
      label: 'Workspace Actions',
      group: 'Project',
      command: 'workspace',
      children: [
        {
          value: 'git',
          label: 'Git Operations',
          group: 'Version Control',
          command: 'git',
          children: [
            {
              value: 'checkout-main',
              label: 'Checkout main',
              command: 'checkout-main',
              shortcut: 'g m',
            },
            {
              value: 'checkout-feature',
              label: 'Checkout feature/commands',
              command: 'checkout-feature',
              active: true,
            },
          ],
        },
        {
          value: 'format',
          label: 'Format Workspace',
          group: 'Maintenance',
          command: 'format',
          shortcut: 'Shift+Alt+f',
        },
      ],
    },
    {
      value: 'appearance',
      label: 'Appearance & Themes',
      group: 'Settings',
      command: 'appearance',
      children: [
        {
          value: 'catppuccin',
          label: 'Catppuccin Mocha',
          group: 'Color Themes',
          command: 'catppuccin',
          active: true,
        },
        {
          value: 'dracula',
          label: 'Dracula Pro',
          group: 'Color Themes',
          command: 'dracula',
        },
      ],
    },
  ];

  let open = $state(false);
  let selectedPath = $state('None');
</script>

<VStack class="w-full gap-3 rounded-lg border border-border bg-card p-4">
  <HStack class="flex-wrap items-center justify-between gap-2">
    <HStack class="items-center gap-2">
      <span class="text-xs font-medium text-muted-foreground">Selected path:</span>
      <Badge variant="subtle" color="secondary" data-testid="cp-nested-selected">
        {selectedPath}
      </Badge>
    </HStack>
    <Button
      size="sm"
      variant="outline"
      data-testid="cp-nested-open"
      onclick={() => {
        open = true;
      }}
    >
      Open Nested Palette
    </Button>
  </HStack>
  <p class="text-xs text-muted-foreground">
    Select a branch item with <Kbd size="sm">Enter</Kbd> or <Kbd size="sm">→</Kbd> to drill
    multiple levels deep, click any breadcrumb pill in the header to jump up, or press
    <Kbd size="sm">⌫</Kbd> on an empty search input to pop one level.
  </p>
  <CommandPalette
    items={NESTED_TREE}
    bind:open
    onSelectCommand={(ctx) => {
      selectedPath = ctx.valuePath.join(' › ');
    }}
  />
</VStack>
