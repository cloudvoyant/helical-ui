<!-- apps/docs/src/components/examples/listbox/default/svelte.svelte -->
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
    { value: 'react', label: 'React' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
    { value: 'solid', label: 'Solid' },
  ];
</script>

<Listbox {items} defaultValue={['svelte']}>
  <ListboxContent>
    {#each items as item}
      <ListboxItem {item}>
        <ListboxItemText>{item.label}</ListboxItemText>
        <ListboxItemIndicator><Check /></ListboxItemIndicator>
      </ListboxItem>
    {/each}
  </ListboxContent>
</Listbox>
