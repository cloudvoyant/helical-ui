<!-- apps/docs/src/components/examples/questions/multiple/svelte.svelte -->
<script lang="ts">
  import { MultipleChoiceQuestion } from '@cloudvoyant/helical-svelte';
</script>

<MultipleChoiceQuestion
  id="multiple-demo"
  prompt="Select the primitives."
  choices={['string', 'number', 'widget', 'boolean']}
  correct={[0, 1, 3]}
  explanation="Widget is not a primitive."
/>
