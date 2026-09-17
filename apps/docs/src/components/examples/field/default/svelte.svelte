<!-- apps/docs/src/components/examples/field/default/svelte.svelte -->
<script lang="ts">
  import { Field, FieldLabel, FieldRequiredIndicator, FieldHelper, FieldError, Input } from '@cloudvoyant/helical-svelte';
</script>

<Field invalid class="max-w-sm">
  <FieldLabel>
    Username
    <FieldRequiredIndicator />
  </FieldLabel>
  <Input defaultValue="jane" />
  <FieldHelper>Pick something memorable.</FieldHelper>
  <FieldError>Username is already taken.</FieldError>
</Field>
