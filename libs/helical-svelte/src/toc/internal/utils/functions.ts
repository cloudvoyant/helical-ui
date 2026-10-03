// libs/helical-svelte/src/toc/internal/utils/functions.ts
// Minimal local copies of the `@zag-js/utils` helpers the vendored TOC hook needs.
// Ark's source imports them from `@zag-js/utils`; that package is only a transitive
// dependency here, so helical-ui keeps local copies instead of declaring an extra
// direct dependency. Behaviour matches upstream:
//   const runIfFn = (v, ...a) => { const res = typeof v === 'function' ? v(...a) : v; return res ?? undefined }
// See ../README.md.
export type MaybeFunction<T> = T | (() => T);

export const runIfFn = <T>(value: MaybeFunction<T> | undefined): T | undefined =>
  typeof value === 'function' ? (value as () => T)() : value;
