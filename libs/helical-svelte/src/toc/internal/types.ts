// libs/helical-svelte/src/toc/internal/types.ts
// Ark UI declares these part-prop types inside each component's `<script module>`
// block. Its published build turns them into `.svelte.d.ts` files, which this
// repository's `svelte-package`/`tsc` toolchain cannot resolve from a `.ts` module
// (`tsc` reports TS2614 for types exported from a `.svelte` module script, because
// the bare `*.svelte` wildcard module has no type members).
//
// The types are therefore declared here and imported by both the parts and the
// private barrel. Every exported name and shape is identical to Ark's.
import type { Snippet } from 'svelte';
import type { ItemProps } from '@zag-js/toc';
import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from './utils/types';
import type { UseTocContext } from './use-toc-context';
import type { UseTocProps, UseTocReturn } from './use-toc.svelte';

export type TocContentBaseProps = PolymorphicProps<'article'> & RefAttribute;
export type TocContentProps = Assign<HTMLProps<'article'>, TocContentBaseProps>;

export type TocContextProps = {
  render: Snippet<[UseTocContext]>;
};

export type TocIndicatorBaseProps = PolymorphicProps<'div'> & RefAttribute;
export type TocIndicatorProps = Assign<HTMLProps<'div'>, TocIndicatorBaseProps>;

export type TocItemBaseProps = ItemProps & PolymorphicProps<'li'> & RefAttribute;
export type TocItemProps = Assign<HTMLProps<'li'>, TocItemBaseProps>;

export type TocLinkBaseProps = PolymorphicProps<'a'> & RefAttribute;
export type TocLinkProps = Assign<HTMLProps<'a'>, TocLinkBaseProps>;

export type TocListBaseProps = PolymorphicProps<'ul'> & RefAttribute;
export type TocListProps = Assign<HTMLProps<'ul'>, TocListBaseProps>;

export type TocNavBaseProps = Partial<UseTocProps> &
  PolymorphicProps<'nav'> &
  RefAttribute & {
    placement?: 'left' | 'right';
  };
export type TocNavProps = Assign<HTMLProps<'nav'>, TocNavBaseProps>;

export type TocRootBaseProps = UseTocProps & PolymorphicProps<'div'> & RefAttribute;
export type TocRootProps = Assign<HTMLProps<'div'>, TocRootBaseProps>;

export type TocRootProviderBaseProps = PolymorphicProps<'div'> & RefAttribute & { value: UseTocReturn };
export type TocRootProviderProps = Assign<HTMLProps<'div'>, TocRootProviderBaseProps>;

export type TocTitleBaseProps = PolymorphicProps<'h2'> & RefAttribute;
export type TocTitleProps = Assign<HTMLProps<'h2'>, TocTitleBaseProps>;
