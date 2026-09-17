// libs/helical-react/src/manim.tsx
// Closely based on: diffbook Manim (packages/diffbook-ui/src/components/Manim.impl.tsx).
// Client-only: the scene builder is a prop, so the manim code lives in the component and
// `manim-web` is imported lazily on mount.
import { useEffect, useRef, useState } from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import {
  manimRootBase,
  manimContainerBase,
  manimPlaceholderBase,
  manimPlaceholderLabelBase,
  manimErrorBase,
  manimCaptionBase,
  cn,
} from '@cloudvoyant/helical-ui';
import type { ManimProps as ManimPropsBase, ManimRecordingScene, ManimModule } from '@cloudvoyant/helical-ui';

interface ManimPlayer {
  sequence(builder: (scene: ManimRecordingScene) => Promise<void>): Promise<void>;
  dispose?(): void;
}

type Status = 'loading' | 'ready' | 'error';

export type ManimProps = HTMLArkProps<'figure'> & ManimPropsBase;

export function Manim({ build, width = 800, height = 450, caption, className, ...props }: ManimProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let disposed = false;
    let player: ManimPlayer | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let mountedWidth = 0;
    let generation = 0;

    function fail(msg: string): void {
      if (!disposed) {
        setErrorMsg(msg);
        setState('error');
      }
    }

    async function mount(pixelWidth: number): Promise<void> {
      const gen = ++generation;
      try {
        const manim: ManimModule = await import('manim-web');
        if (disposed || gen !== generation || !containerRef.current) return;

        try {
          player?.dispose?.();
        } catch {
          // ignore disposal errors
        }
        containerRef.current.replaceChildren();
        mountedWidth = pixelWidth;

        player = new manim.Player(containerRef.current, {
          width: pixelWidth,
          height: Math.round((pixelWidth * height) / width),
          backgroundOpacity: 0,
          autoPlay: true,
          loop: false,
        }) as unknown as ManimPlayer;
        setState('ready');
        await player.sequence(async (scene) => {
          await build(manim, scene);
        });
      } catch (err) {
        if (gen === generation) {
          fail(`Failed to load animation: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    const initialWidth = Math.floor(wrapper.getBoundingClientRect().width);
    if (initialWidth > 0) void mount(initialWidth);

    const observer = new ResizeObserver((entries) => {
      const measured = Math.floor(entries[0]?.contentRect.width ?? 0);
      if (measured <= 0 || measured === mountedWidth) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!disposed) void mount(measured);
      }, 200);
    });
    observer.observe(wrapper);

    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      observer.disconnect();
      try {
        player?.dispose?.();
      } catch {
        // ignore disposal errors
      }
    };
  }, [build, width, height]);

  return (
    <ark.figure data-manim-state={state} className={cn(manimRootBase, className)} {...props}>
      <div ref={wrapperRef} className={manimContainerBase}>
        <div ref={containerRef} className="w-full" />
        {state === 'loading' && (
          <div className={manimPlaceholderBase} style={{ aspectRatio: `${width} / ${height}` }}>
            <span className={manimPlaceholderLabelBase}>Loading animation…</span>
          </div>
        )}
        {state === 'error' && <div className={manimErrorBase}>{errorMsg}</div>}
      </div>
      {caption ? <ark.figcaption className={manimCaptionBase}>{caption}</ark.figcaption> : null}
    </ark.figure>
  );
}
