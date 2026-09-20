<!-- libs/helical-svelte/src/toc/internal/toc-root.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-root.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { createSplitProps } from './utils/create-split-props';
  import { TocProvider } from './use-toc-context';
  import { useToc, type UseTocProps } from './use-toc.svelte';
  import type { TocRootProps } from './types';

  let { ref = $bindable(null), ...props }: TocRootProps = $props();
  const providedId = $props.id();

  const [useTocProps, localProps] = $derived(
    createSplitProps<UseTocProps>()(props, [
      'activeIds',
      'autoScroll',
      'defaultActiveIds',
      'scrollEl',
      'id',
      'ids',
      'items',
      'onActiveChange',
      'rootMargin',
      'scrollBehavior',
      'threshold',
    ]),
  );

  const resolvedProps = $derived({ ...useTocProps, id: useTocProps.id ?? providedId });
  const toc = useToc(() => resolvedProps);

  TocProvider(toc);
</script>

<Ark as="div" bind:ref {...localProps} />
