<!-- libs/helical-svelte/src/toc/internal/toc-root-provider.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-root-provider.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { TocProvider } from './use-toc-context';
  import type { TocRootProviderProps } from './types';

  let { ref = $bindable(null), value, ...props }: TocRootProviderProps = $props();

  TocProvider(() => value());
</script>

<!-- Local deviation from upstream Ark: upstream also merges `value().getRootProps()` here,
     which duplicates the root `id`, `data-part="root"`, and `aria-labelledby` on both this
     wrapper div and the nested `TocNav`. The high-level `Toc` keeps the root attributes on
     the nav only (matching React), so this stays a plain context + styling wrapper. -->
<Ark as="div" bind:ref {...props} />
