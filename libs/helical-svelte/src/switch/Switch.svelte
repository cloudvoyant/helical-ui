<!-- libs/helical-svelte/src/switch/Switch.svelte -->
<!-- Closely based on: Shark UI switch (@ark-ui/svelte/switch), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { setContext } from 'svelte';
  import { SwitchRoot, SwitchHiddenInput, type SwitchRootProps } from '@ark-ui/svelte/switch';
  import { cn } from '@cloudvoyant/helical-ui';

  type Props = SwitchRootProps & {
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  };

  let { size = 'md', class: className = '', children, ...rest }: Props = $props();

  setContext<'sm' | 'md' | 'lg'>('switch-size', size);

  const classes = $derived(cn('flex items-center gap-2', className));
</script>

<SwitchRoot class={classes} {...rest}>
  {@render children?.()}
  <SwitchHiddenInput />
</SwitchRoot>
