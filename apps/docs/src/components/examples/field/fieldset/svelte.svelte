<!-- apps/docs/src/components/examples/field/fieldset/svelte.svelte -->
<script lang="ts">
  import { FieldSet, FieldSetLegend, Field, FieldLabel, Input } from '@cloudvoyant/helical-svelte';
</script>

<FieldSet class="max-w-sm">
  <FieldSetLegend>Billing address</FieldSetLegend>
  <Field>
    <FieldLabel>Street</FieldLabel>
    <Input placeholder="123 Main St" />
  </Field>
  <Field>
    <FieldLabel>City</FieldLabel>
    <Input placeholder="Springfield" />
  </Field>
</FieldSet>
