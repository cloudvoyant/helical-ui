<!-- apps/docs/src/components/examples/input/default/svelte.svelte -->
<script lang="ts">
  import { Field, FieldLabel, FieldHelper, Input } from '@cloudvoyant/helical-svelte';
</script>

<Field class="max-w-sm">
  <FieldLabel>Email</FieldLabel>
  <Input type="email" placeholder="you@example.com" />
  <FieldHelper>We'll never share your email.</FieldHelper>
</Field>
