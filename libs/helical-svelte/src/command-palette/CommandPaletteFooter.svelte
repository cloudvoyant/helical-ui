<script lang="ts">
  // 1. Imports
  import { CornerDownLeft } from 'lucide-svelte';
  import { cn, commandPaletteStyles } from '@cloudvoyant/helical-ui';
  import Kbd from '../Kbd.svelte';
  import Row from '../Row.svelte';
  import { getCommandPaletteContext } from './context.svelte';

  // 2. Module constants & types
  interface Props {
    class?: string;
    className?: string;
  }

  // --- State ---
  let { class: className = '', className: reactClassName = '' }: Props = $props();

  const ctx = getCommandPaletteContext();
</script>

<div class={cn(commandPaletteStyles.footer, className, reactClassName)}>
  <Row class="items-center gap-3">
    <span class="inline-flex items-center gap-1">
      <Kbd size="sm">↑</Kbd>
      <Kbd size="sm">↓</Kbd>
      <span>Navigate</span>
    </span>
    <span class="inline-flex items-center gap-1">
      <Kbd size="sm">
        <CornerDownLeft class="size-3" />
      </Kbd>
      <span>Select</span>
    </span>
    {#if ctx.resolution.breadcrumbs.length > 0}
      <span class="inline-flex items-center gap-1">
        <Kbd size="sm">⌫</Kbd>
        <span>Back</span>
      </span>
    {/if}
  </Row>
  <span class="text-[11px] text-muted-foreground">
    {ctx.resolution.breadcrumbs.length > 0
      ? ctx.resolution.breadcrumbs.map((b) => b.label).join(' › ')
      : '⌘K'}
  </span>
</div>
