<!-- apps/docs/src/components/examples/questions/numeric/svelte.svelte -->
<script lang="ts">
  import { NumericQuestion } from '@cloudvoyant/helical-svelte';
</script>

<NumericQuestion
  id="numeric-demo"
  prompt="What is 2 + 2?"
  answer={4}
  tolerance={0.5}
  unit="units"
  explanation="Basic arithmetic."
/>
