<!-- libs/helical-svelte/src/command/CommandProvider.svelte -->
<script lang="ts">
  // 1. Imports
  import type { Snippet } from 'svelte';
  import {
    createCommandTree,
    type CommandContextProps,
    type CommandStyle,
  } from '@cloudvoyant/helical-ui/commands';
  import { setCommandContext } from './context.svelte';

  // 2. Module constants & types
  type Props = CommandContextProps & {
    children?: Snippet;
  };

  // --- State ---
  let {
    items,
    collection,
    open: controlledOpen = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    style: controlledStyle = $bindable(undefined),
    defaultStyle = 'palette',
    onStyleChange,
    onSelectCommand,
    children,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let uncontrolledOpen = $state(Boolean(defaultOpen));
  // svelte-ignore state_referenced_locally
  let uncontrolledStyle = $state<CommandStyle>(defaultStyle);

  const open = $derived(controlledOpen ?? uncontrolledOpen);
  const style = $derived(controlledStyle ?? uncontrolledStyle);
  const tree = $derived(createCommandTree(collection ?? items ?? []));

  // --- Methods ---
  function setOpen(nextOpen: boolean) {
    if (controlledOpen !== undefined) {
      controlledOpen = nextOpen;
    } else {
      uncontrolledOpen = nextOpen;
    }
    onOpenChange?.(nextOpen);
  }

  function setStyle(nextStyle: CommandStyle) {
    if (controlledStyle !== undefined) {
      controlledStyle = nextStyle;
    } else {
      uncontrolledStyle = nextStyle;
    }
    onStyleChange?.(nextStyle);
  }

  setCommandContext({
    get items() {
      return items;
    },
    get collection() {
      return collection;
    },
    get tree() {
      return tree;
    },
    get open() {
      return open;
    },
    setOpen,
    get style() {
      return style;
    },
    setStyle,
    openPalette() {
      setStyle('palette');
      setOpen(true);
    },
    openMenu() {
      setStyle('menu');
      setOpen(true);
    },
    openColon() {
      setStyle('menu');
      setOpen(true);
    },
    close() {
      setOpen(false);
    },
    toggle() {
      setOpen(!open);
    },
    get onSelectCommand() {
      return onSelectCommand;
    },
  });
</script>

{@render children?.()}
