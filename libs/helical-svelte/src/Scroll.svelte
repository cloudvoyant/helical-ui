<!-- libs/helical-svelte/src/Scroll.svelte -->
<!-- Closely based on: @ark-ui/svelte/scroll-area (Ark UI), Chakra UI ScrollArea, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    ScrollAreaRoot,
    ScrollAreaViewport,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaCorner,
  } from '@ark-ui/svelte/scroll-area';
  import type { ScrollAreaRootProps } from '@ark-ui/svelte/scroll-area';
  import {
    scrollRootBase,
    scrollViewportBase,
    scrollContentBase,
    scrollScrollbarBase,
    scrollThumbBase,
    scrollCornerBase,
    cn,
  } from '@cloudvoyant/helical-ui';

  type Props = ScrollAreaRootProps & {
    orientation?: 'vertical' | 'horizontal' | 'both';
    /** `default` shows the styled scrollbars; `hidden` keeps scrolling without rendering any scrollbar. */
    variant?: 'default' | 'hidden';
    contentClass?: string;
    thumbClass?: string;
    /** Overrides the viewport class. The default is `flex h-full w-full flex-col`;
     * for horizontal scrolling wrap content in a flex row or override this. */
    viewportClass?: string;
  };

  let {
    class: className = '',
    orientation = 'vertical',
    variant = 'default',
    contentClass = '',
    thumbClass = '',
    viewportClass = '',
    children,
    ...rest
  }: Props = $props();

  const rootClasses = $derived(cn(scrollRootBase, className));
  const viewportClasses = $derived(cn(scrollViewportBase, viewportClass));
  const contentClasses = $derived(cn(scrollContentBase, contentClass));
  const thumbClasses = $derived(cn(scrollThumbBase, thumbClass));
</script>

<ScrollAreaRoot class={rootClasses} {...rest}>
  <ScrollAreaViewport class={viewportClasses}>
    <ScrollAreaContent class={contentClasses}>
      {@render children?.()}
    </ScrollAreaContent>
  </ScrollAreaViewport>
  {#if variant !== 'hidden'}
    {#if orientation === 'vertical' || orientation === 'both'}
      <ScrollAreaScrollbar orientation="vertical" class={scrollScrollbarBase}>
        <ScrollAreaThumb class={thumbClasses} />
      </ScrollAreaScrollbar>
    {/if}
    {#if orientation === 'horizontal' || orientation === 'both'}
      <ScrollAreaScrollbar orientation="horizontal" class={scrollScrollbarBase}>
        <ScrollAreaThumb class={thumbClasses} />
      </ScrollAreaScrollbar>
    {/if}
    {#if orientation === 'both'}
      <ScrollAreaCorner class={scrollCornerBase} />
    {/if}
  {/if}
</ScrollAreaRoot>
