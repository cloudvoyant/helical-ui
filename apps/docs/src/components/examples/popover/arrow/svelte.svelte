<!-- apps/docs/src/components/examples/popover/arrow/svelte.svelte -->
<script lang="ts">
  import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-svelte';
</script>

<Popover>
  <PopoverTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
    Open Popover
  </PopoverTrigger>
  <PopoverContent arrow>
    <PopoverTitle>Notifications</PopoverTitle>
    <PopoverDescription>You have 3 unread messages in your inbox.</PopoverDescription>
  </PopoverContent>
</Popover>
