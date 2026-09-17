<!-- libs/helical-svelte/src/YouTube.svelte -->
<!-- Closely based on: diffbook YouTube, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { Play } from 'lucide-svelte';
  import { setContext } from 'svelte';
  import {
    youtubeRootBase,
    youtubeTitleBase,
    youtubeFacadeBase,
    youtubePlayButtonBase,
    youtubePlayButtonInnerBase,
    youtubeDescriptionBase,
    extractYouTubeId,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    url: string;
    title?: string;
    description?: string;
    poster?: string;
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { url, title, description, poster, class: className = '', children, ...rest }: Props = $props();

  const videoId = $derived(extractYouTubeId(url));
  const posterUrl = $derived(poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);

  let playing = $state(false);
  let startAt = $state<number | null>(null);

  const seek = (t: number) => {
    startAt = t;
    playing = true;
  };

  setContext('helical-ui-youtube', {
    get url() {
      return url;
    },
    get videoId() {
      return videoId;
    },
    seek,
  });

  const src = $derived(
    `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1${startAt != null ? `&start=${startAt}` : ''}`,
  );

  const classes = $derived(cn(youtubeRootBase, className));
</script>

<Ark as="div" data-youtube-id={videoId} class={classes} {...rest}>
  {#if title}<Ark as="h3" class={youtubeTitleBase}>{title}</Ark>{/if}
  {#if playing}
    <iframe
      {src}
      title={title ?? `YouTube video ${videoId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="aspect-video w-full rounded-md border border-border"
    ></iframe>
  {:else}
    <Ark as="button" type="button" class={youtubeFacadeBase} onclick={() => (playing = true)} aria-label={title ? `Play video: ${title}` : 'Play video'}>
      <Ark as="img" src={posterUrl} alt={title ?? `YouTube video ${videoId}`} loading="lazy" class="h-full w-full object-cover" />
      <Ark as="span" class={youtubePlayButtonBase} aria-hidden="true">
        <Ark as="span" class={youtubePlayButtonInnerBase}>
          <Play class="size-8 fill-current" aria-hidden="true" data-youtube-logo />
        </Ark>
      </Ark>
    </Ark>
  {/if}
  {#if description}<Ark as="p" class={youtubeDescriptionBase}>{description}</Ark>{/if}
  {#if children}{@render children()}{/if}
</Ark>
