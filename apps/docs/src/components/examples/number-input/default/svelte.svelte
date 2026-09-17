<!-- apps/docs/src/components/examples/number-input/default/svelte.svelte -->
<script lang="ts">
  import { NumberInput, NumberInputControl, NumberInputInput, NumberInputDecrement, NumberInputIncrement } from '@cloudvoyant/helical-svelte';
  import { Minus, Plus } from 'lucide-svelte';
</script>

<NumberInput min={0} max={10} defaultValue="5" class="max-w-xs">
  <NumberInputControl>
    <NumberInputDecrement>
      <Minus />
    </NumberInputDecrement>
    <NumberInputInput />
    <NumberInputIncrement>
      <Plus />
    </NumberInputIncrement>
  </NumberInputControl>
</NumberInput>
