<!-- libs/helical-svelte/src/PageGutter.svelte -->
<!-- No upstream component; composed from @cloudvoyant/helical-ui page classes, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { pageGutterAreaBase, pageGutterVariants, pageGutterContentVariants, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    contentClass?: string;
    side?: 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    class: className = '',
    contentClass = '',
    side = 'left',
    align = 'start',
    children,
    ...rest
  }: Props = $props();

  const areaClasses = $derived(cn(pageGutterAreaBase, side === 'right' && '[grid-area:right]'));
  const gutterClasses = $derived(cn(pageGutterVariants({ side }), className));
  const contentClasses = $derived(cn(pageGutterContentVariants({ align }), contentClass));
</script>

<div data-slot="page-gutter-area" class={areaClasses}>
  <Ark as="div" data-slot="page-gutter" class={gutterClasses} {...rest}>
    <div data-slot="page-gutter-content" class={contentClasses}>
      {@render children?.()}
    </div>
  </Ark>
</div>
