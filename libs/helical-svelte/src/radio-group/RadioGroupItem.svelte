<!-- libs/helical-svelte/src/radio-group/RadioGroupItem.svelte -->
<!-- Closely based on: Shark UI radio group (@ark-ui/svelte/radio-group), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    RadioGroupItem as ArkRadioGroupItem,
    RadioGroupItemControl,
    RadioGroupItemText,
    RadioGroupItemHiddenInput,
    type RadioGroupItemProps,
  } from '@ark-ui/svelte/radio-group';
  import { radioGroupItemControlBase, radioGroupItemTextBase, cn } from '@cloudvoyant/helical-ui';

  type Props = RadioGroupItemProps & { class?: string };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn('flex cursor-pointer items-center gap-2.5', className));
</script>

<ArkRadioGroupItem class={classes} {...rest}>
  <RadioGroupItemControl class={radioGroupItemControlBase}>
    <span class="size-1.5 rounded-full bg-current hidden [[data-state=checked]>&]:block"></span>
  </RadioGroupItemControl>
  <RadioGroupItemText class={radioGroupItemTextBase}>{@render children?.()}</RadioGroupItemText>
  <RadioGroupItemHiddenInput />
</ArkRadioGroupItem>
