<!-- libs/helical-svelte/src/Input.svelte -->
<!-- Closely based on: Shark UI input (@ark-ui/svelte/field), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FieldInput, type FieldInputProps } from '@ark-ui/svelte/field';
  import { inputVariants, cn } from '@cloudvoyant/helical-ui';

  type Props = Omit<FieldInputProps, 'size'> & {
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  };

  let { size = 'md', class: className = '', ...rest }: Props = $props();

  const classes = $derived(cn(inputVariants({ size }), className));
</script>

<FieldInput class={classes} {...rest} />
