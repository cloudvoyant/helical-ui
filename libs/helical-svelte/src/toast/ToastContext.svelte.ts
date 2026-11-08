// libs/helical-svelte/src/toast/ToastContext.svelte.ts
// Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react

// 1. Imports
import {
  createToaster,
  useToastContext,
  type CreateToasterProps,
  type CreateToasterReturn,
  type ToastOptions,
} from '@ark-ui/svelte/toast';

// 2. Module constants & types
export { createToaster, useToastContext };
export type { CreateToasterProps, CreateToasterReturn, ToastOptions };

const globalToastState = globalThis as typeof globalThis & {
  __helicalDefaultToaster__?: CreateToasterReturn;
};

export const toast: CreateToasterReturn = (globalToastState.__helicalDefaultToaster__ ??= createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 5,
}));

// 3. Local helpers / hooks
export function useToast(toasterInstance: CreateToasterReturn = toast): CreateToasterReturn {
  return toasterInstance;
}
