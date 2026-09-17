<!-- libs/helical-svelte/src/radio-group/RadioGroup.svelte -->
<!-- Closely based on: Shark UI radio group (@ark-ui/svelte/radio-group), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { RadioGroupRoot, type RadioGroupRootProps } from '@ark-ui/svelte/radio-group';
  import { radioGroupRootBase, cn } from '@cloudvoyant/helical-ui';

  type Props = RadioGroupRootProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(radioGroupRootBase, className));
</script>

<RadioGroupRoot class={classes} {...rest}>
  {@render children?.()}
</RadioGroupRoot>
