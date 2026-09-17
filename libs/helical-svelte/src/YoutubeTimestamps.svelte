<!-- libs/helical-svelte/src/YoutubeTimestamps.svelte -->
<!-- Composed timestamps list, auto-inferred from web metadata or overridden manually via
     YoutubeTimestampAt children. Mirrored from @cloudvoyant/helical-react. -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { getContext } from 'svelte';
  import {
    youtubeChaptersBase,
    youtubeChaptersSummaryBase,
    youtubeChaptersChevronBase,
    youtubeChaptersListBase,
    youtubeChapterButtonBase,
    youtubeChapterTimeBase,
    youtubeChapterLabelBase,
    formatTime,
    parseYouTubeChapters,
    fetchYouTubeMetadata,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { YouTubeChapter } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    chapters?: YouTubeChapter[];
    children?: Snippet;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let { chapters = undefined, children, class: className = '', ...rest }: Props = $props();

  const ctx = getContext<{ url: string; seek: (t: number) => void }>('helical-ui-youtube');

  let inferred = $state<YouTubeChapter[]>([]);
  let loading = $state(chapters === undefined);

  $effect(() => {
    if (chapters !== undefined) {
      loading = false;
      return;
    }
    let cancelled = false;
    loading = true;
    fetchYouTubeMetadata(ctx.url)
      .then((meta) => {
        if (!cancelled) {
          inferred = meta.description ? parseYouTubeChapters(meta.description) : [];
          loading = false;
        }
      })
      .catch(() => {
        if (!cancelled) loading = false;
      });
    return () => {
      cancelled = true;
    };
  });

  const resolved = $derived(chapters ?? inferred);

  const seek = (t: number) => ctx.seek(t);

  const classes = $derived(cn(youtubeChaptersBase, className));
</script>

{#if loading || resolved.length > 0 || children}
  <Ark as="div" class={classes} {...rest}>
    <details class="group" open>
      <Ark as="summary" class={youtubeChaptersSummaryBase}>
        <svg
          class={youtubeChaptersChevronBase}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
        <span>Timestamps</span>
      </Ark>
      <Ark as="nav" aria-label="Video timestamps" class={youtubeChaptersListBase}>
        <Ark as="ul" class="space-y-1">
          {#each resolved as ch (ch.t)}
            <Ark as="li">
              <Ark as="button" type="button" onclick={() => seek(ch.t)} class={youtubeChapterButtonBase}>
                <Ark as="span" class={youtubeChapterTimeBase}>{formatTime(ch.t)}</Ark>
                <Ark as="span" class={youtubeChapterLabelBase}>{ch.label}</Ark>
              </Ark>
            </Ark>
          {/each}
          {#if children}{@render children()}{/if}
        </Ark>
      </Ark>
    </details>
  </Ark>
{/if}
