<!-- libs/helical-svelte/src/YoutubeTimestampAt.svelte -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { getContext } from 'svelte';
  import { youtubeChapterButtonBase, youtubeChapterTimeBase, youtubeChapterLabelBase, formatTime } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = { t: number; children?: Snippet; class?: string } & HTMLAttributes<HTMLElement>;
  let { t, children, class: className = '', ...rest }: Props = $props();

  const ctx = getContext<{ seek: (t: number) => void }>('helical-ui-youtube');
</script>

<Ark as="li" class={className} {...rest}>
  <Ark as="button" type="button" onclick={() => ctx.seek(t)} class={youtubeChapterButtonBase}>
    <Ark as="span" class={youtubeChapterTimeBase}>{formatTime(t)}</Ark>
    <Ark as="span" class={youtubeChapterLabelBase}>{#if children}{@render children()}{/if}</Ark>
  </Ark>
</Ark>
