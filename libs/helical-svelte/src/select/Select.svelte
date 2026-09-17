<!-- libs/helical-svelte/src/select/Select.svelte -->
<!-- Closely based on: Shark UI select + native-select (@ark-ui/svelte/select), mirrored from @cloudvoyant/helical-react -->
<!-- Note: adapted to Ark UI v5 collection-based API (SelectRoot `collection` + SelectItem `item`). -->
<script lang="ts">
  import {
    SelectRoot,
    SelectHiddenSelect,
    createListCollection,
    type SelectRootProps,
    type ListCollection,
  } from '@ark-ui/svelte/select';
  import type { SelectItemData } from '@cloudvoyant/helical-ui';
  import SelectNative from './SelectNative.svelte';

  type Props = Omit<SelectRootProps<SelectItemData>, 'collection'> & {
    items?: SelectItemData[];
    collection?: ListCollection<SelectItemData>;
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  };

  let {
    items,
    collection,
    size = 'md',
    class: className = '',
    children,
    value,
    defaultValue,
    onValueChange,
    invalid,
    disabled,
    name,
    form,
    required,
    ...rest
  }: Props = $props();

  const resolvedCollection = $derived(collection ?? createListCollection({ items: items ?? [] }));

  let isCoarse = $state(false);

  $effect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    isCoarse = mql.matches;
    const onChange = () => (isCoarse = mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  });
</script>

{#if isCoarse && items}
  <SelectNative
    {items}
    {size}
    value={value?.[0]}
    defaultValue={defaultValue?.[0]}
    onValueChange={(v) => onValueChange?.({ value: [v], items: [] })}
    {invalid}
    {disabled}
    {name}
    {form}
    {required}
  />
{:else}
  <SelectRoot collection={resolvedCollection} {value} {defaultValue} {onValueChange} {invalid} {disabled} {name} {form} {required} class={className} {...rest}>
    {@render children?.()}
    <SelectHiddenSelect />
  </SelectRoot>
{/if}
