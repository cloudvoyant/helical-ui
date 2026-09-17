<!-- apps/docs/src/components/examples/combobox/multiple/svelte.svelte -->
<script lang="ts">
  import {
    Combobox,
    ComboboxControl,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxItemText,
    ComboboxItemIndicator,
  } from '@cloudvoyant/helical-svelte';
  import { Check } from 'lucide-svelte';

  const items = [
    { value: 'react', label: 'React' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'vue', label: 'Vue' },
  ];
</script>

<Combobox multiple defaultValue={['react', 'svelte']} {items} class="max-w-xs">
  <ComboboxControl>
    <ComboboxInput placeholder="Select frameworks…" />
  </ComboboxControl>
  <ComboboxContent>
    <ComboboxList>
      {#each items as item (item.value)}
        <ComboboxItem {item}>
          <ComboboxItemText>{item.label}</ComboboxItemText>
          <ComboboxItemIndicator>
            <Check />
          </ComboboxItemIndicator>
        </ComboboxItem>
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
