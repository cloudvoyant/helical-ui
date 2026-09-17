<!-- libs/helical-svelte/src/select/SelectNative.svelte -->
<!-- Closely based on: Shark UI native-select (@ark-ui/svelte/factory), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { nativeSelectVariants, nativeSelectWrapperBase, nativeSelectIconBase, cn } from '@cloudvoyant/helical-ui';
  import type { SelectItemData } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  type Props = Omit<HTMLSelectAttributes, 'value' | 'children' | 'size'> & {
    items: SelectItemData[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    invalid?: boolean;
    icon?: Snippet;
    class?: string;
  };

  let {
    items = [],
    value,
    defaultValue,
    onValueChange,
    size = 'md',
    invalid,
    icon,
    class: className = '',
    ...rest
  }: Props = $props();

  const classes = $derived(nativeSelectVariants({ size }));
  const wrapperClasses = $derived(cn(nativeSelectWrapperBase, className));

  let current = $state(value ?? defaultValue ?? '');

  $effect(() => {
    if (value !== undefined) current = value;
  });

  function handleChange(event: Event) {
    const next = (event.currentTarget as HTMLSelectElement).value;
    current = next;
    onValueChange?.(next);
  }
</script>

<Ark as="div" class={wrapperClasses}>
  <Ark
    as="select"
    class={classes}
    value={current}
    aria-invalid={invalid}
    onchange={handleChange}
    {...rest}
  >
    {#each items as item (item.value)}
      <option value={item.value} disabled={item.disabled}>
        {item.label}
      </option>
    {/each}
  </Ark>
  <Ark as="span" class={nativeSelectIconBase} aria-hidden>
    {#if icon}
      {@render icon()}
    {:else}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    {/if}
  </Ark>
</Ark>
