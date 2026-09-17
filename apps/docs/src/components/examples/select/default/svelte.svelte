<!-- apps/docs/src/components/examples/select/default/svelte.svelte -->
<script lang="ts">
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectIndicator,
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectItemIndicator,
  } from '@cloudvoyant/helical-svelte';
  import { Check, ChevronsUpDown } from 'lucide-svelte';

  const items = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];
</script>

<Select {items} defaultValue={['apple']} class="max-w-xs">
  <SelectTrigger>
    <SelectValue />
    <SelectIndicator>
      <ChevronsUpDown />
    </SelectIndicator>
  </SelectTrigger>
  <SelectContent>
    {#each items as item (item.value)}
      <SelectItem {item}>
        <SelectItemText>{item.label}</SelectItemText>
        <SelectItemIndicator>
          <Check />
        </SelectItemIndicator>
      </SelectItem>
    {/each}
  </SelectContent>
</Select>
