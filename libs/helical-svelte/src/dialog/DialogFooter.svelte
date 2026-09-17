<!-- libs/helical-svelte/src/dialog/DialogFooter.svelte -->
<!-- Closely based on: @cloudvoyant/helical-react DialogFooter -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { dialogFooterBase, dialogFooterStickyBase, cn } from '@cloudvoyant/helical-ui';

  interface Props {
    class?: string;
    sticky?: boolean;
    children?: Snippet;
  }

  let { class: className = '', sticky = false, children }: Props = $props();

  const classes = $derived(cn(dialogFooterBase, sticky && dialogFooterStickyBase, className));
</script>

<div class={classes}>
  {@render children?.()}
</div>
