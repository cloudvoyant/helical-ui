<!-- libs/helical-svelte/src/SidebarProvider.svelte -->
<!-- Source: @ark-ui/svelte/factory + drawer (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    SIDEBAR_WIDTH,
    SIDEBAR_WIDTH_ICON,
    SIDEBAR_KEYBOARD_SHORTCUT,
    sidebarStyles,
    cn,
    type SidebarContextProps,
  } from '@cloudvoyant/helical-ui';
  import { setSidebarContext } from './context.svelte';
  import Row from '../Row.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { defaultOpen = true, open: openProp, onOpenChange, class: className = '', style, children, ...rest }: Props = $props();

  let isMobile = $state(false);
  let openMobile = $state(false);
  // svelte-ignore state_referenced_locally
  let _open = $state(defaultOpen);
  const open = $derived(openProp ?? _open);
  const contextState = $derived<SidebarContextProps['state']>(open ? 'expanded' : 'collapsed');

  const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === 'function' ? value(open) : value;
    if (onOpenChange) {
      onOpenChange(openState);
    } else {
      _open = openState;
    }
    if (typeof document !== 'undefined') {
      document.cookie = `sidebar_state=${openState}; path=/; max-age=604800`;
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      openMobile = !openMobile;
    } else {
      setOpen((o) => !o);
    }
  };

  $effect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = () => {
      isMobile = window.innerWidth < 768;
    };
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  });

  $effect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  setSidebarContext({
    get state() {
      return contextState;
    },
    get open() {
      return open;
    },
    setOpen,
    get openMobile() {
      return openMobile;
    },
    setOpenMobile(value: boolean | ((open: boolean) => boolean)) {
      openMobile = typeof value === 'function' ? value(openMobile) : value;
    },
    get isMobile() {
      return isMobile;
    },
    toggleSidebar,
  });
</script>

<Row
  data-slot="sidebar-wrapper"
  class={cn(sidebarStyles.wrapperClass, className)}
  style={`--sidebar-width: ${SIDEBAR_WIDTH}; --sidebar-width-icon: ${SIDEBAR_WIDTH_ICON}; ${style ?? ''}`}
  {...rest}
>
  {@render children?.()}
</Row>
