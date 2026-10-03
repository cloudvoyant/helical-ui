<!-- libs/helical-svelte/src/toc/internal/toc-context.svelte -->
<!-- Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/toc-context.svelte).
     Prop types live in ./types.ts — see the note there. -->
<script lang="ts">
  import { useTocContext } from './use-toc-context';
  import type { TocContextProps } from './types';

  const { render }: TocContextProps = $props();

  const toc = useTocContext();
</script>

{@render render(toc)}
