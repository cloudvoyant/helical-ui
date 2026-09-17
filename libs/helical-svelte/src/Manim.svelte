<!-- libs/helical-svelte/src/Manim.svelte -->
<!-- Closely based on: diffbook Manim, rebuilt with the scene builder as a prop (client-only),
     mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import {
    manimRootBase,
    manimContainerBase,
    manimPlaceholderBase,
    manimPlaceholderLabelBase,
    manimErrorBase,
    manimCaptionBase,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { ManimRecordingScene, ManimModule } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Status = 'loading' | 'ready' | 'error';

  interface ManimPlayerLike {
    sequence(builder: (scene: ManimRecordingScene) => Promise<void>): Promise<void>;
    dispose?(): void;
  }

  type Props = {
    build: (manim: ManimModule, scene: ManimRecordingScene) => Promise<void> | void;
    width?: number;
    height?: number;
    caption?: string;
    class?: string;
  } & HTMLAttributes<HTMLElement>;

  let {
    build,
    width = 800,
    height = 450,
    caption,
    class: className = '',
    ...rest
  }: Props = $props();

  let wrapper: HTMLDivElement;
  let container: HTMLDivElement;
  let status: Status = $state('loading');
  let errorMsg: string = $state('');

  $effect(() => {
    const w = wrapper;
    if (!w) return;
    let disposed = false;
    let player: ManimPlayerLike | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let mountedWidth = 0;
    let generation = 0;

    async function mount(pixelWidth: number): Promise<void> {
      const gen = ++generation;
      try {
        const manim: ManimModule = await import('manim-web');
        if (disposed || gen !== generation || !container) return;
        player?.dispose?.();
        container.replaceChildren();
        mountedWidth = pixelWidth;
        player = new manim.Player(container, {
          width: pixelWidth,
          height: Math.round((pixelWidth * height) / width),
          backgroundOpacity: 0,
          autoPlay: true,
          loop: false,
        }) as unknown as ManimPlayerLike;
        status = 'ready';
        const current = player;
        await current.sequence(async (scene) => {
          await build(manim, scene);
        });
      } catch (err) {
        if (gen === generation) {
          errorMsg = `Failed to load animation: ${err instanceof Error ? err.message : String(err)}`;
          status = 'error';
        }
      }
    }

    const initialWidth = Math.floor(w.getBoundingClientRect().width);
    if (initialWidth > 0) void mount(initialWidth);

    const observer = new ResizeObserver((entries) => {
      const measured = Math.floor(entries[0]?.contentRect.width ?? 0);
      if (measured <= 0 || measured === mountedWidth) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!disposed) void mount(measured);
      }, 200);
    });
    observer.observe(w);

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      observer.disconnect();
      player?.dispose?.();
    };
  });

  const classes = $derived(cn(manimRootBase, className));
</script>

<Ark as="figure" data-manim-state={status} class={classes} {...rest}>
  <div bind:this={wrapper} class={manimContainerBase}>
    <div bind:this={container} class="w-full"></div>
    {#if status === 'loading'}
      <div class={manimPlaceholderBase} style={`aspect-ratio: ${width} / ${height};`}>
        <span class={manimPlaceholderLabelBase}>Loading animation…</span>
      </div>
    {/if}
    {#if status === 'error'}<div class={manimErrorBase}>{errorMsg}</div>{/if}
  </div>
  {#if caption}<Ark as="figcaption" class={manimCaptionBase}>{caption}</Ark>{/if}
</Ark>
