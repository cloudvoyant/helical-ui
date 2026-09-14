<!-- apps/docs/src/components/examples/listbox/controlled/svelte.svelte -->
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
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  let value = $state<string[]>(['md']);
  const selected = $derived(items.find((item) => item.value === value[0]));
</script>

<div class="flex flex-col gap-3">
  <p class="text-sm text-muted-foreground">Selected: {selected?.label ?? 'None'}</p>
  <Listbox {items} {value} onValueChange={(details) => (value = details.value)}>
    <ListboxContent>
      {#each items as item}
        <ListboxItem {item}>
          <ListboxItemText>{item.label}</ListboxItemText>
          <ListboxItemIndicator><Check /></ListboxItemIndicator>
        </ListboxItem>
      {/each}
    </ListboxContent>
  </Listbox>
</div>
