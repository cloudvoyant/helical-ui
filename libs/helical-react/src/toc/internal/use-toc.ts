// libs/helical-react/src/toc/internal/use-toc.ts
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/components/toc/use-toc.ts).
//
// Local adaptation: Ark's monorepo-relative `../../providers` imports are replaced
// with the published `@ark-ui/react/environment` / `@ark-ui/react/locale` context
// hooks. Both ship SSR-safe defaults (`getRootNode: () => document`, `dir: 'ltr'`),
// so no local fallback is required. See ../README.md.
import { useEnvironmentContext } from '@ark-ui/react/environment';
import { useLocaleContext } from '@ark-ui/react/locale';
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/react';
import * as toc from '@zag-js/toc';
import { useId } from 'react';
import type { Optional } from './utils/types';

export type UseTocProps = Optional<Omit<toc.Props, 'dir' | 'getRootNode'>, 'id'>;

export type UseTocReturn = toc.Api<PropTypes>;

export const useToc = (props?: UseTocProps): UseTocReturn => {
  const id = useId();
  const { getRootNode } = useEnvironmentContext();
  const { dir } = useLocaleContext();

  const machineProps = {
    id,
    dir,
    getRootNode,
    items: [],
    ...props,
    // Keep the bottom of the real viewport observable so a short final heading
    // can become active at the end of the scroll root.
    rootMargin: props?.rootMargin ?? '-20px 0px 0px 0px',
  } as toc.Props;

  const service = useMachine(toc.machine, machineProps);
  return toc.connect(service, normalizeProps);
};
