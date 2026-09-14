<!-- apps/docs/src/components/examples/listbox/multiple/svelte.svelte -->
<script lang="ts">
  import {
    Listbox,
    ListboxContent,
    ListboxItem,
    ListboxItemText,
    ListboxItemIndicator,
  } from '@cloudvoyant/vortex-svelte';
  import { Check } from 'lucide-svelte';

  const items = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ];
</script>

<Listbox {items} selectionMode="multiple" defaultValue={['red', 'blue']}>
  <ListboxContent>
    {#each items as item}
      <ListboxItem {item}>
        <ListboxItemText>{item.label}</ListboxItemText>
        <ListboxItemIndicator><Check /></ListboxItemIndicator>
      </ListboxItem>
    {/each}
  </ListboxContent>
</Listbox>
