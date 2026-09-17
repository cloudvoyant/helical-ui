<!-- apps/docs/src/components/examples/dialog/multiple-triggers/svelte.svelte -->
<script lang="ts">
  import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogBackdrop } from '@cloudvoyant/helical-svelte';

  const sections = [
    { id: 'general', title: 'General', body: 'General account settings.' },
    { id: 'privacy', title: 'Privacy', body: 'Privacy and data settings.' },
    { id: 'billing', title: 'Billing', body: 'Billing and payment settings.' },
  ];

  let open = $state(false);
  let active = $state(sections[0]);
</script>

<div class="flex flex-col items-center gap-4">
  <div class="flex items-center gap-2">
    {#each sections as section (section.id)}
      <button
        type="button"
        class="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
        onclick={() => {
          active = section;
          open = true;
        }}
      >
        {section.title}
      </button>
    {/each}
  </div>
  <Dialog bind:open>
    <DialogBackdrop />
    <DialogContent>
      <DialogTitle>{active.title}</DialogTitle>
      <DialogDescription>{active.body}</DialogDescription>
    </DialogContent>
  </Dialog>
</div>
