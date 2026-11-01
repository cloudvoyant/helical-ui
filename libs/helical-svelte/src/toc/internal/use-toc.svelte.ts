// libs/helical-svelte/src/toc/internal/use-toc.svelte.ts
// Vendored from Ark UI (chakra-ui/ark, packages/svelte/src/lib/components/toc/use-toc.svelte.ts).
//
// Local adaptation: Ark's `$lib/providers/*` and `$lib/types` aliases are replaced
// with the published `@ark-ui/svelte/environment` / `@ark-ui/svelte/locale` hooks
// and this folder's `./utils/types`. Both published providers ship SSR-safe
// defaults (`getRootNode: () => document`, `dir: 'ltr'`). See ../README.md.
import { useEnvironmentContext } from '@ark-ui/svelte/environment';
import { useLocaleContext } from '@ark-ui/svelte/locale';
import * as toc from '@zag-js/toc';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/svelte';
import { type MaybeFunction, runIfFn } from './utils/functions';
import type { Accessor, Optional } from './utils/types';

export type UseTocProps = Optional<Omit<toc.Props, 'dir' | 'getRootNode'>, 'id'>;
export type UseTocReturn = Accessor<toc.Api<PropTypes>>;

export const useToc = (props?: MaybeFunction<UseTocProps>): UseTocReturn => {
  const env = useEnvironmentContext();
  const locale = useLocaleContext();

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props);
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
      // Keep the bottom of the real viewport observable so a short final
      // heading can become active at the end of the scroll root.
      rootMargin: resolvedProps?.rootMargin ?? '-20px 0px 0px 0px',
    };
  });

  const service = useMachine(toc.machine, () => machineProps);
  const api = $derived(toc.connect(service, normalizeProps));
  return () => api;
};
