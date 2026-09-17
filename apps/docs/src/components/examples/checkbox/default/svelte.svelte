<!-- apps/docs/src/components/examples/checkbox/default/svelte.svelte -->
<script lang="ts">
  import { Checkbox, CheckboxControl, CheckboxIndicator, CheckboxLabel } from '@cloudvoyant/helical-svelte';
  import { Check } from 'lucide-svelte';
</script>

<div class="flex flex-col gap-4">
  <Checkbox defaultChecked>
    <CheckboxControl>
      <CheckboxIndicator>
        <Check />
      </CheckboxIndicator>
    </CheckboxControl>
    <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
  </Checkbox>
  <Checkbox>
    <CheckboxControl>
      <CheckboxIndicator>
        <Check />
      </CheckboxIndicator>
    </CheckboxControl>
    <CheckboxLabel>Subscribe to the newsletter</CheckboxLabel>
  </Checkbox>
</div>
