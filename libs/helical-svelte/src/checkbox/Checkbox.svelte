<!-- libs/helical-svelte/src/checkbox/Checkbox.svelte -->
<!-- Closely based on: Shark UI checkbox (@ark-ui/svelte/checkbox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { setContext } from 'svelte';
  import { CheckboxRoot, CheckboxHiddenInput, type CheckboxRootProps } from '@ark-ui/svelte/checkbox';
  import { cn } from '@cloudvoyant/helical-ui';

  type Props = CheckboxRootProps & {
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  };

  let { size = 'md', class: className = '', children, ...rest }: Props = $props();

  setContext<'sm' | 'md' | 'lg'>('checkbox-size', size);

  const classes = $derived(cn('flex items-center gap-2', className));
</script>

<CheckboxRoot class={classes} {...rest}>
  {@render children?.()}
  <CheckboxHiddenInput />
</CheckboxRoot>
