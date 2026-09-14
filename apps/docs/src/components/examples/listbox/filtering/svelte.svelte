<!-- apps/docs/src/components/examples/listbox/filtering/svelte.svelte -->
<!-- Filtering is consumer-owned: `visible` is filtered with defaultListboxFilter and the SAME -->
<!-- array is passed to Listbox and rendered, so collection and children cannot diverge. -->
<!-- Ark's ListboxInput is a typeahead input with no controlled query prop, so the consumer owns -->
<!-- the query via plain value/oninput. It is a SIBLING of ListboxContent while the Listbox -->
<!-- root keeps both controls inside one visual surface. -->
<script lang="ts">
  import {
    Listbox,
    ListboxContent,
    ListboxItem,
    ListboxItemText,
    ListboxItemIndicator,
    ListboxInput,
    ListboxEmpty,
  } from '@cloudvoyant/vortex-svelte';
  import { defaultListboxFilter } from '@cloudvoyant/vortex-ui';
  import { Check } from 'lucide-svelte';

  const items = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
  ];

  let query = $state('');
  const visible = $derived(items.filter((item) => defaultListboxFilter(item, query)));
</script>

<Listbox items={visible}>
  <ListboxInput
    value={query}
    oninput={(event) => (query = (event.currentTarget as HTMLInputElement).value)}
    autoHighlight
    placeholder="Filter fruit…"
  />
  <ListboxContent>
    {#each visible as item}
      <ListboxItem {item}>
        <ListboxItemText>{item.label}</ListboxItemText>
        <ListboxItemIndicator><Check /></ListboxItemIndicator>
      </ListboxItem>
    {/each}
    <ListboxEmpty>No fruit matches “{query}”.</ListboxEmpty>
  </ListboxContent>
</Listbox>
