<!-- libs/helical-svelte/src/toast/Toaster.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Portal } from '@ark-ui/svelte/portal';
  import {
    Toaster as ArkToaster,
    type CreateToasterReturn,
    type ToasterProps as ArkToasterProps,
    type ToastOptions,
  } from '@ark-ui/svelte/toast';
  import { cn, toasterBase } from '@cloudvoyant/helical-ui';
  import { toast as defaultToaster } from './ToastContext.svelte';
  import ToastItem from './ToastItem.svelte';

  type Props = Omit<ArkToasterProps, 'toaster' | 'children'> & {
    toaster?: CreateToasterReturn;
    children?: Snippet<[() => ToastOptions]>;
    class?: string;
    className?: string;
  };

  let {
    toaster: toasterInstance = defaultToaster,
    children: customChildren,
    class: className = '',
    className: reactClassName = '',
    ...rest
  }: Props = $props();
</script>

<Portal>
  <ArkToaster
    data-testid="toaster"
    toaster={toasterInstance}
    class={cn(toasterBase, className, reactClassName)}
    {...rest}
  >
    {#snippet children(toastAccessor)}
      {#if customChildren}
        {@render customChildren(toastAccessor)}
      {:else}
        <ToastItem toast={toastAccessor()} />
      {/if}
    {/snippet}
  </ArkToaster>
</Portal>
