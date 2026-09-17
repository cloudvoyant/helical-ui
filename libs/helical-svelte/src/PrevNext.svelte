<!-- libs/helical-svelte/src/PrevNext.svelte -->
<!-- Closely based on: diffbook PrevNext (packages/diffbook-ui/src/components/PrevNext.tsx),
     mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import {
    prevNextRootBase,
    prevNextLinkBase,
    prevNextLinkNextBase,
    prevNextDirectionBase,
    prevNextTitleBase,
    prevNextSpacerBase,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    prev?: { title: string; href: string };
    next?: { title: string; href: string };
    class?: string;
  } & HTMLAttributes<HTMLElement>;

  let { prev, next, class: className = '', ...rest }: Props = $props();

  const classes = $derived(cn(prevNextRootBase, className));
</script>

{#if prev || next}
  <Ark as="nav" class={classes} aria-label="Previous and next pages" {...rest}>
    {#if prev}
      <Ark as="a" href={prev.href} class={prevNextLinkBase}>
        <Ark as="span" class={prevNextDirectionBase}>Previous</Ark>
        <Ark as="span" class={prevNextTitleBase}>← {prev.title}</Ark>
      </Ark>
    {:else}
      <Ark as="span" class={prevNextSpacerBase}></Ark>
    {/if}
    {#if next}
      <Ark as="a" href={next.href} class={cn(prevNextLinkBase, prevNextLinkNextBase)}>
        <Ark as="span" class={prevNextDirectionBase}>Next</Ark>
        <Ark as="span" class={prevNextTitleBase}>{next.title} →</Ark>
      </Ark>
    {:else}
      <Ark as="span" class={prevNextSpacerBase}></Ark>
    {/if}
  </Ark>
{/if}
