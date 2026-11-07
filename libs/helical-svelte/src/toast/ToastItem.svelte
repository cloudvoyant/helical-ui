<!-- libs/helical-svelte/src/toast/ToastItem.svelte -->
<!-- Closely based on: Shark UI toast (@ark-ui/svelte/toast), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import type { ToastOptions, ToastRootProps } from '@ark-ui/svelte/toast';
  import { CircleAlert, CircleCheck, Info, Loader2, TriangleAlert } from 'lucide-svelte';
  import { toastIconBase } from '@cloudvoyant/helical-ui';
  import Col from '../Col.svelte';
  import Row from '../Row.svelte';
  import ToastActionTrigger from './ToastActionTrigger.svelte';
  import ToastCloseTrigger from './ToastCloseTrigger.svelte';
  import ToastDescription from './ToastDescription.svelte';
  import ToastRoot from './ToastRoot.svelte';
  import ToastTitle from './ToastTitle.svelte';

  type Props = ToastRootProps & {
    toast: ToastOptions;
    class?: string;
    className?: string;
  };

  let { toast: toastData, class: className = '', className: reactClassName = '', ...rest }: Props = $props();

  const isClosable = $derived(toastData.closable !== false);
</script>

<ToastRoot data-testid="toast-item" class={className} className={reactClassName} {...rest}>
  <Row class="min-w-0 flex-1 items-start gap-2.5">
    {#if toastData.type === 'success'}
      <div data-slot="toast-icon" class={toastIconBase}>
        <CircleCheck aria-hidden="true" />
      </div>
    {:else if toastData.type === 'error'}
      <div data-slot="toast-icon" class={toastIconBase}>
        <CircleAlert aria-hidden="true" />
      </div>
    {:else if toastData.type === 'warning'}
      <div data-slot="toast-icon" class={toastIconBase}>
        <TriangleAlert aria-hidden="true" />
      </div>
    {:else if toastData.type === 'info'}
      <div data-slot="toast-icon" class={toastIconBase}>
        <Info aria-hidden="true" />
      </div>
    {:else if toastData.type === 'loading'}
      <div data-slot="toast-icon" class={toastIconBase}>
        <Loader2 class="animate-spin" aria-hidden="true" />
      </div>
    {/if}

    <Col class="min-w-0 flex-1 gap-0.5">
      {#if toastData.title}
        <ToastTitle data-testid="toast-title">
          {toastData.title}
        </ToastTitle>
      {/if}
      {#if toastData.description}
        <ToastDescription data-testid="toast-description">
          {toastData.description}
        </ToastDescription>
      {/if}
    </Col>
  </Row>

  <Row class="shrink-0 items-center gap-1.5">
    {#if toastData.action}
      <ToastActionTrigger
        data-testid="toast-action"
        onclick={toastData.action.onClick}
      >
        {toastData.action.label}
      </ToastActionTrigger>
    {/if}
    {#if isClosable}
      <ToastCloseTrigger data-testid="toast-close" />
    {/if}
  </Row>
</ToastRoot>
