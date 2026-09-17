<!-- libs/helical-svelte/src/Figure.svelte -->
<!-- Closely based on: diffbook Figure (packages/diffbook-ui/src/components/Figure.tsx),
     mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { figureRootBase, figureImageBase, figureCaptionBase, cn } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    src?: string;
    alt?: string;
    caption?: string;
    /** A custom image element (e.g. `<img srcSet="…" sizes="…">`). When provided it replaces
     *  the default `<img>` built from `src`/`alt`. */
    img?: Snippet;
    class?: string;
  } & HTMLAttributes<HTMLElement>;

  let { src, alt, img, caption, class: className = '', ...rest }: Props = $props();

  const classes = $derived(cn(figureRootBase, className));
</script>

<Ark as="figure" class={classes} {...rest}>
  {#if img}
    {@render img()}
  {:else if src}
    <Ark as="img" {src} {alt} loading="lazy" class={figureImageBase} />
  {/if}
  {#if caption}<Ark as="figcaption" class={figureCaptionBase}>{caption}</Ark>{/if}
</Ark>
