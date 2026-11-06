// libs/helical-svelte/src/toast/ToastContext.svelte.ts
// Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react
import {
  createToaster,
  useToastContext,
  type CreateToasterProps,
  type CreateToasterReturn,
  type ToastOptions,
} from '@ark-ui/svelte/toast';

export const useToast = useToastContext;
export { createToaster, useToastContext };
export type { CreateToasterProps, CreateToasterReturn, ToastOptions };

export const toast = createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 5,
});
