// libs/helical-react/src/navbar.tsx
// Closely based on: shadcnblocks navbar6 / navbar7 (design reference),
//                   re-based on @ark-ui/react/navigation-menu + collapsible (Ark UI)
/// <reference lib="dom" />
import * as React from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { Portal } from '@ark-ui/react/portal';
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from '@ark-ui/react/collapsible';
import {
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogCloseTrigger,
  DialogTitle,
  DialogDescription,
} from '@ark-ui/react/dialog';
import {
  NavigationMenuRoot as ArkNavMenuRoot,
  NavigationMenuList as ArkNavMenuList,
  NavigationMenuItem as ArkNavMenuItem,
  NavigationMenuTrigger as ArkNavMenuTrigger,
  NavigationMenuContent as ArkNavMenuContent,
  NavigationMenuLink as ArkNavMenuLink,
  NavigationMenuViewport as ArkNavMenuViewport,
  NavigationMenuViewportPositioner as ArkNavMenuViewportPositioner,
  NavigationMenuIndicator as ArkNavMenuIndicator,
  type NavigationMenuRootProps as NavbarMenuRootProps,
  type NavigationMenuListProps as NavbarMenuListProps,
  type NavigationMenuItemProps as NavbarMenuItemProps,
  type NavigationMenuTriggerProps as NavbarMenuTriggerProps,
  type NavigationMenuContentProps as NavbarMenuContentProps,
  type NavigationMenuLinkProps as NavbarMenuLinkProps,
  type NavigationMenuViewportProps as NavbarMenuViewportProps,
  type NavigationMenuViewportPositionerProps as NavbarMenuViewportPositionerProps,
  type NavigationMenuIndicatorProps as NavbarMenuIndicatorProps,
} from '@ark-ui/react/navigation-menu';
import {
  navbarVariants,
  navbarContainerBase,
  navbarDensityVariants,
  navbarShrunkBase,
  navbarBrandBase,
  navbarMenuBase,
  navbarMenuPlacementVariants,
  navbarActionsBase,
  navbarTriggerVariants,
  navbarActivationAreaBase,
  navbarMobileContentBase,
  navbarMobileHeaderBase,
  navbarMobileMenuBase,
  navbarMobileActionsBase,
  navbarMenuRootBase,
  navbarMenuListBase,
  navbarMenuItemBase,
  navbarMenuTriggerStyle,
  navbarMenuContentBase,
  navbarMenuLinkBase,
  navbarMobileMenuContentBase,
  navbarMobileMenuTriggerBase,
  navbarMenuViewportPositionerBase,
  navbarMenuViewportBase,
  navbarMenuIndicatorBase,
  cn,
  type NavbarDensity,
  type NavbarVariant,
  type NavbarMenuDensity,
  type NavbarMenuVariant,
} from '@cloudvoyant/helical-ui';

const SCROLL_THRESHOLD = 24;

// Resolve the nearest scrollable ancestor (e.g. a demo container with
// overflow-y-auto); null means the viewport itself scrolls.
function resolveScrollContainer(el: HTMLElement | null): HTMLElement | null {
  for (let n: HTMLElement | null = el; n; n = n.parentElement) {
    const oy = getComputedStyle(n).overflowY;
    if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') return n;
  }
  return null;
}

interface NavbarContextValue {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  scrolled: boolean;
  setScrolled: (scrolled: boolean) => void;
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
  slots: { brand: React.ReactNode; actions: React.ReactNode };
  setSlot: (key: 'brand' | 'actions', node: React.ReactNode) => void;
  variant: NavbarVariant;
  floating: boolean;
  density: NavbarDensity;
  /** The element the mobile overlay portals into (the header's parent). */
  portalRef: React.RefObject<HTMLElement | null>;
}

const NavbarContext = React.createContext<NavbarContextValue | null>(null);

function useNavbar() {
  const context = React.useContext(NavbarContext);
  if (!context) {
    throw new Error('Navbar parts must be used within a NavbarProvider.');
  }
  return context;
}

function useNavbarSlot(key: 'brand' | 'actions', children: React.ReactNode) {
  const { setSlot } = useNavbar();
  React.useLayoutEffect(() => {
    setSlot(key, children);
  }, [key, children, setSlot]);
}

interface NavbarMenuStyle {
  density: NavbarMenuDensity;
  variant: NavbarMenuVariant;
  inContent: boolean;
}

const NavbarMenuStyleContext = React.createContext<NavbarMenuStyle>({
  density: 'relaxed',
  variant: 'default',
  inContent: false,
});

function NavbarProvider({ defaultOpen = false, children }: { defaultOpen?: boolean; children: React.ReactNode }) {
  const id = React.useId();
  const [open, setOpen] = React.useState(defaultOpen);
  const [scrolled, setScrolled] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [slots, setSlots] = React.useState<{ brand: React.ReactNode; actions: React.ReactNode }>({
    brand: null,
    actions: null,
  });
  const portalRef = React.useRef<HTMLElement | null>(null);

  const setSlot = React.useCallback((key: 'brand' | 'actions', node: React.ReactNode) => {
    setSlots((prev) => (prev[key] === node ? prev : { ...prev, [key]: node }));
  }, []);

  const contextValue = React.useMemo(
    () => ({
      id,
      open,
      setOpen,
      scrolled,
      setScrolled,
      hovered,
      setHovered,
      slots,
      setSlot,
      portalRef,
      // Baseline config; the Navbar header overrides these with its props.
      variant: 'sticky' as NavbarVariant,
      floating: false,
      density: 'relaxed' as NavbarDensity,
    }),
    [id, open, scrolled, hovered, slots, setSlot],
  );

  return <NavbarContext.Provider value={contextValue}>{children}</NavbarContext.Provider>;
}

function Navbar({
  variant = 'sticky',
  floating = false,
  density = 'relaxed',
  className,
  children,
  ...props
}: React.ComponentProps<'header'> & {
  variant?: NavbarVariant;
  floating?: boolean;
  density?: NavbarDensity;
}) {
  const base = useNavbar();
  const headerRef = React.useRef<HTMLElement>(null);
  const { setScrolled, setHovered } = base;

  React.useEffect(() => {
    // Listen to the nearest scrollable ancestor (e.g. a demo container with
    // overflow-y-auto); fall back to the window. `position: sticky` sticks
    // relative to that same container, so data-scrolled stays in sync.
    const target = resolveScrollContainer(headerRef.current) ?? window;
    const getY = () => (target === window ? window.scrollY : (target as Element).scrollTop);
    const onScroll = () => setScrolled(getY() > SCROLL_THRESHOLD);
    onScroll();
    (target as EventTarget).addEventListener('scroll', onScroll, { passive: true });
    return () => (target as EventTarget).removeEventListener('scroll', onScroll);
  }, [setScrolled]);

  const value = React.useMemo(() => ({ ...base, variant, floating, density }), [base, variant, floating, density]);
  const hidden = variant === 'hide' && base.scrolled && !base.hovered;
  const shrunk = variant === 'shrink' && base.scrolled;

  React.useLayoutEffect(() => {
    // Anchor the mobile overlay to the element that contains the bar (its
    // parent), so it covers the surrounding container rather than the window.
    base.portalRef.current = headerRef.current?.parentElement ?? null;
  });

  // The mobile overlay portals into the bar's scroll container. Lock that
  // container's scroll while the overlay is open so the background can't be
  // scrolled past it; Ark's body scroll lock is disabled. When no ancestor is
  // scrollable the viewport scrolls, so lock the documentElement instead.
  React.useEffect(() => {
    if (!base.open) return;
    const el = resolveScrollContainer(headerRef.current) ?? document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = 'hidden';
    return () => {
      el.style.overflow = prev;
    };
  }, [base.open]);

  return (
    <NavbarContext.Provider value={value}>
      <header
        ref={headerRef}
        data-slot="navbar"
        data-scrolled={base.scrolled || undefined}
        data-hidden={hidden || undefined}
        data-shrunk={shrunk || undefined}
        className={cn(
          navbarVariants({ variant, floating }),
          navbarContainerBase,
          navbarDensityVariants({ density }),
          shrunk && navbarShrunkBase,
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {children}
      </header>
    </NavbarContext.Provider>
  );
}

function NavbarActivationArea({ className, children, ...props }: HTMLArkProps<'div'>) {
  const { setHovered } = useNavbar();
  return (
    <ark.div
      data-slot="navbar-activation-area"
      className={cn(navbarActivationAreaBase, className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </ark.div>
  );
}

function NavbarBrand({ className, children, ...props }: HTMLArkProps<'div'>) {
  useNavbarSlot('brand', children);
  return (
    <ark.div data-slot="navbar-brand" className={cn(navbarBrandBase, className)} {...props}>
      {children}
    </ark.div>
  );
}

function NavbarMenu({
  placement = 'center',
  className,
  children,
  ...props
}: NavbarMenuRootProps & { placement?: 'left' | 'center' | 'right' }) {
  const { scrolled, density, variant } = useNavbar();
  const menuDensity: NavbarMenuDensity =
    density === 'compact' || (variant === 'shrink' && scrolled) ? 'compact' : 'relaxed';
  return (
    <NavbarMenuStyleContext.Provider value={{ density: menuDensity, variant: 'default', inContent: false }}>
      <ark.div
        data-slot="navbar-menu"
        data-placement={placement}
        className={cn(navbarMenuBase, navbarMenuPlacementVariants({ placement }), className)}
      >
        <ArkNavMenuRoot data-density={menuDensity} className={cn(navbarMenuRootBase)} {...props}>
          {children}
          <ArkNavMenuViewportPositioner className={cn(navbarMenuViewportPositionerBase)}>
            <ArkNavMenuViewport className={cn(navbarMenuViewportBase)} />
          </ArkNavMenuViewportPositioner>
        </ArkNavMenuRoot>
      </ark.div>
    </NavbarMenuStyleContext.Provider>
  );
}

function NavbarMenuList({ className, children, ...props }: NavbarMenuListProps) {
  return (
    <ArkNavMenuList className={cn(navbarMenuListBase, className)} {...props}>
      {children}
    </ArkNavMenuList>
  );
}

function NavbarMenuItem({
  variant = 'default',
  className,
  ...props
}: NavbarMenuItemProps & { variant?: NavbarMenuVariant }) {
  const { density } = React.useContext(NavbarMenuStyleContext);
  return (
    <NavbarMenuStyleContext.Provider value={{ density, variant, inContent: false }}>
      <ArkNavMenuItem data-variant={variant} className={cn(navbarMenuItemBase, className)} {...props} />
    </NavbarMenuStyleContext.Provider>
  );
}

function NavbarMenuTrigger({ asChild, className, children, ...props }: NavbarMenuTriggerProps) {
  const { density, variant } = React.useContext(NavbarMenuStyleContext);
  const chevron = (
    <svg
      className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
  return (
    <ArkNavMenuTrigger
      asChild={asChild}
      className={cn(navbarMenuTriggerStyle({ density, variant }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children}
          {chevron}
        </>
      )}
    </ArkNavMenuTrigger>
  );
}

function NavbarMenuContent({ className, children, ...props }: NavbarMenuContentProps) {
  return (
    <NavbarMenuStyleContext.Provider value={{ density: 'relaxed', variant: 'default', inContent: true }}>
      <ArkNavMenuContent className={cn(navbarMenuContentBase, className)} {...props}>
        {children}
      </ArkNavMenuContent>
    </NavbarMenuStyleContext.Provider>
  );
}

function NavbarMenuLink({ className, children, ...props }: NavbarMenuLinkProps) {
  const { density, variant, inContent } = React.useContext(NavbarMenuStyleContext);
  const classes = inContent
    ? cn(navbarMenuLinkBase, className)
    : cn(navbarMenuTriggerStyle({ density, variant }), className);
  return (
    <ArkNavMenuLink className={classes} {...props}>
      {children}
    </ArkNavMenuLink>
  );
}

function NavbarMobileMenu({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <CollapsibleRoot data-slot="navbar-mobile-menu" className={cn('group', className)} {...props}>
      {children}
    </CollapsibleRoot>
  );
}

function NavbarMobileMenuTrigger({ className, children, ...props }: React.ComponentProps<'button'>) {
  return (
    <CollapsibleTrigger asChild>
      <button
        type="button"
        data-slot="navbar-mobile-menu-trigger"
        className={cn(navbarMobileMenuTriggerBase, className)}
        {...props}
      >
        {children}
        <svg
          className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </CollapsibleTrigger>
  );
}

function NavbarMobileMenuContent({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <CollapsibleContent>
      <div data-slot="navbar-mobile-menu-content" className={cn(navbarMobileMenuContentBase, className)} {...props}>
        {children}
      </div>
    </CollapsibleContent>
  );
}

function NavbarMenuViewport({ className, ...props }: NavbarMenuViewportProps) {
  return <ArkNavMenuViewport className={cn(navbarMenuViewportBase, className)} {...props} />;
}

function NavbarMenuIndicator({ className, ...props }: NavbarMenuIndicatorProps) {
  return <ArkNavMenuIndicator className={cn(navbarMenuIndicatorBase, className)} {...props} />;
}

function NavbarActions({ className, children, ...props }: HTMLArkProps<'div'>) {
  useNavbarSlot('actions', children);
  return (
    <ark.div data-slot="navbar-actions" className={cn(navbarActionsBase, className)} {...props}>
      {children}
    </ark.div>
  );
}

function NavbarTrigger({
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}: React.ComponentProps<'button'> & { 'aria-label'?: string }) {
  const { id, open, setOpen, floating } = useNavbar();
  return (
    <button
      type="button"
      data-slot="navbar-trigger"
      aria-expanded={open}
      aria-controls={id}
      aria-label={ariaLabel ?? 'Toggle navigation menu'}
      className={cn(navbarTriggerVariants({ floating }), 'md:hidden', className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children ?? (
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      )}
    </button>
  );
}

function NavbarMobileOverlay({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { id, open, setOpen, slots, floating, portalRef } = useNavbar();

  // Ark's focus trap doesn't engage for a controlled dialog (no DialogTrigger),
  // so Escape isn't handled — add a minimal fallback.
  React.useEffect(() => {
    if (!open) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [open, setOpen]);

  return (
    <Portal container={portalRef}>
      <DialogRoot open={open} lazyMount unmountOnExit onOpenChange={({ open }) => setOpen(open)} preventScroll={false}>
        <DialogBackdrop className="absolute inset-0 z-[100] bg-background/60 backdrop-blur-sm" />
        <DialogPositioner className="absolute inset-0 z-[100]">
          <DialogContent
            id={id}
            data-slot="navbar-mobile-overlay"
            className={cn(navbarMobileContentBase, className)}
            {...props}
          >
            <DialogTitle className="sr-only">Navigation menu</DialogTitle>
            <DialogDescription className="sr-only">Mobile navigation menu</DialogDescription>
            <div className={navbarMobileHeaderBase}>
              {slots.brand}
              <DialogCloseTrigger asChild>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className={cn(navbarTriggerVariants({ floating }))}
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </DialogCloseTrigger>
            </div>
            <div className={navbarMobileMenuBase}>{children}</div>
            {slots.actions ? <div className={navbarMobileActionsBase}>{slots.actions}</div> : null}
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Portal>
  );
}

export { Navbar };
export {
  NavbarProvider,
  NavbarActivationArea,
  NavbarBrand,
  NavbarMenu,
  NavbarActions,
  NavbarTrigger,
  NavbarMobileOverlay,
  NavbarMenuList,
  NavbarMenuItem,
  NavbarMenuTrigger,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMobileMenu,
  NavbarMobileMenuTrigger,
  NavbarMobileMenuContent,
  NavbarMenuViewport,
  NavbarMenuIndicator,
  useNavbar,
};
export { ArkNavMenuViewportPositioner as NavbarMenuViewportPositioner };
export { navbarMenuTriggerStyle, type NavbarMenuDensity, type NavbarMenuVariant } from '@cloudvoyant/helical-ui';
export type {
  NavbarMenuRootProps,
  NavbarMenuListProps,
  NavbarMenuItemProps,
  NavbarMenuTriggerProps,
  NavbarMenuContentProps,
  NavbarMenuLinkProps,
  NavbarMenuViewportProps,
  NavbarMenuViewportPositionerProps,
  NavbarMenuIndicatorProps,
};
