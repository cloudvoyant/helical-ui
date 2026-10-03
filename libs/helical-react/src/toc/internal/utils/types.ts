// libs/helical-react/src/toc/internal/utils/types.ts
// Vendored from Ark UI (chakra-ui/ark, packages/react/src/types).
// Ark's `Assign` / `Optional` helpers are not published as a standalone subpath,
// so the minimal copies are kept here. See ../README.md.
export type Assign<T, U> = Omit<T, keyof U> & U;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
