// libs/helical-svelte/src/toc/internal/utils/types.ts
// Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/types).
// Ark publishes only `Assign` and `Optional` from the package root, so the
// remaining helpers (`Accessor`, `HTMLProps`, `PolymorphicProps`,
// `RefAttribute`) are copied here. See ../README.md.
import type { Snippet } from 'svelte';
import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';

export type Assign<T, U> = Omit<T, keyof U> & U;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Accessor<T> = () => T;
export type HTMLTag = keyof SvelteHTMLElements;
export type PropsFn<T extends HTMLTag> = (props?: HTMLProps<T>) => HTMLAttributes<HTMLElement>;
export type HTMLProps<T extends HTMLTag> = SvelteHTMLElements[T];

export type PolymorphicProps<T extends HTMLTag> = {
  /**
   * The children snippet of the component.
   */
  children?: Snippet;
  /**
   * Use the provided child element as the default rendered element, combining their props and behavior.
   */
  asChild?: Snippet<[PropsFn<T>]>;
};

export interface RefAttribute<T extends Element = Element> {
  ref?: T | null | undefined;
}
