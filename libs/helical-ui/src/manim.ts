// libs/helical-ui/src/manim.ts
// Closely based on: diffbook Manim (packages/diffbook-ui/src/components/Manim.tsx + Manim.impl.tsx).
import type * as ManimWeb from 'manim-web';

export const manimRootBase = 'not-prose my-4';

export const manimContainerBase =
  'relative w-full overflow-hidden rounded-lg border border-border [&_canvas]:!h-auto [&_canvas]:!max-w-full';

export const manimPlaceholderBase = 'flex w-full items-center justify-center bg-muted/40';

export const manimPlaceholderLabelBase = 'text-sm text-muted-foreground';

export const manimErrorBase =
  'flex items-center justify-center border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive';

export const manimCaptionBase = 'mt-2 text-center text-sm text-muted-foreground';

/** The recording proxy `manim-web` hands to a scene builder — records `play`/`wait` calls. */
export interface ManimRecordingScene {
  play(...animations: unknown[]): Promise<void>;
  wait(duration?: number): Promise<void>;
}

export type ManimModule = typeof ManimWeb;

export interface ManimProps {
  /** Scene builder — receives the `manim-web` module (imported internally by the component) and
   *  the recording proxy. Define the animation with `manim`'s primitives (`Circle`, `Create`, …)
   *  without importing `manim-web` yourself. */
  build: (manim: ManimModule, scene: ManimRecordingScene) => Promise<void> | void;
  /** Aspect-ratio width component (default 800). */
  width?: number;
  /** Aspect-ratio height component (default 450). */
  height?: number;
  caption?: string;
  className?: string;
}
