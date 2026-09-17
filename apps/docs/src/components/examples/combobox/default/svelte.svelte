<!-- apps/docs/src/components/examples/combobox/default/svelte.svelte -->
<script lang="ts">
  import {
    Combobox,
    ComboboxControl,
    ComboboxInput,
    ComboboxTrigger,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxItemText,
  } from '@cloudvoyant/helical-svelte';
  import { ChevronsUpDown } from 'lucide-svelte';

  const items = [
    { value: 'react', label: 'React' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
  ];
</script>

<Combobox {items} class="max-w-xs">
  <ComboboxControl>
    <ComboboxInput placeholder="Search framework…" />
    <ComboboxTrigger>
      <ChevronsUpDown />
    </ComboboxTrigger>
  </ComboboxControl>
  <ComboboxContent>
    <ComboboxList>
      {#each items as item (item.value)}
        <ComboboxItem {item}>
          <ComboboxItemText>{item.label}</ComboboxItemText>
        </ComboboxItem>
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
