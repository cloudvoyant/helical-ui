<!-- apps/docs/src/components/examples/questions/single/svelte.svelte -->
<script lang="ts">
  import { SingleChoiceQuestion } from '@cloudvoyant/helical-svelte';
</script>

<SingleChoiceQuestion
  id="single-demo"
  prompt="Which of these is a JavaScript runtime?"
  choices={['Python', 'Node.js', 'Ruby', 'Go']}
  correct={1}
  explanation="Node.js runs JavaScript outside the browser."
/>
