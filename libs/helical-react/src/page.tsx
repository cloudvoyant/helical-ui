// libs/helical-react/src/page.tsx
// Closely based on: helical-ui layout primitives (Row/Col/Container); scrolling
// gutter content uses Ark UI scroll-area via the Scroll component. No upstream
// component matches this composite — Page is composed from helical-ui primitives.
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import {
  pageVariants,
  pageGutterAreaBase,
  pageGutterVariants,
  pageGutterContentVariants,
  pageContentBase,
  pageFooterBase,
  pageSectionBase,
  type PageVariants,
  type PageGutterVariants,
  type PageGutterContentVariants,
  type PagePaneRegistrationProps,
  cn,
} from '@cloudvoyant/helical-ui';
import { useOptionalPaneRegistration } from './which-key/context';

export type PageProps = HTMLArkProps<'div'> & {
  variant?: PageVariants['variant'];
};

export function Page({ variant = 'default', className, children, ...props }: PageProps) {
  return (
    <ark.div data-slot="page" className={cn(pageVariants({ variant }), className)} {...props}>
      {children}
    </ark.div>
  );
}

export type PageGutterProps = HTMLArkProps<'div'> &
  PagePaneRegistrationProps & {
    side?: PageGutterVariants['side'];
    align?: PageGutterContentVariants['align'];
    contentClassName?: string;
  };

export function PageGutter({
  side = 'left',
  align = 'start',
  contentClassName,
  paneId,
  paneTitle,
  paneDisabled,
  paneOrder,
  className,
  children,
  ...props
}: PageGutterProps) {
  const pane = useOptionalPaneRegistration({
    paneId,
    paneTitle,
    paneDisabled,
    paneOrder,
    defaultTitle: side === 'right' ? 'Right Gutter' : 'Left Gutter',
  });

  return (
    <ark.div data-slot="page-gutter-area" className={cn(pageGutterAreaBase, side === 'right' && '[grid-area:right]')}>
      <ark.div
        ref={pane.ref}
        data-slot="page-gutter"
        {...pane.dataAttributes}
        className={cn(pageGutterVariants({ side }), className)}
        {...props}
      >
        <ark.div data-slot="page-gutter-content" className={cn(pageGutterContentVariants({ align }), contentClassName)}>
          {children}
        </ark.div>
      </ark.div>
    </ark.div>
  );
}

export type PageContentProps = HTMLArkProps<'main'> & PagePaneRegistrationProps;

export function PageContent({
  paneId,
  paneTitle,
  paneDisabled,
  paneOrder,
  className,
  children,
  ...props
}: PageContentProps) {
  const pane = useOptionalPaneRegistration({
    paneId,
    paneTitle,
    paneDisabled,
    paneOrder,
    defaultTitle: 'Main Content',
  });

  return (
    <ark.main
      ref={pane.ref}
      data-slot="page-content"
      {...pane.dataAttributes}
      className={cn(pageContentBase, className)}
      {...props}
    >
      {children}
    </ark.main>
  );
}

export function PageFooter({ className, children, ...props }: HTMLArkProps<'footer'>) {
  return (
    <ark.footer data-slot="page-footer" className={cn(pageFooterBase, className)} {...props}>
      {children}
    </ark.footer>
  );
}

export type PageSectionProps = HTMLArkProps<'section'> & PagePaneRegistrationProps;

export function PageSection({
  paneId,
  paneTitle,
  paneDisabled,
  paneOrder,
  className,
  children,
  ...props
}: PageSectionProps) {
  const pane = useOptionalPaneRegistration({
    paneId,
    paneTitle,
    paneDisabled,
    paneOrder,
    defaultTitle: 'Section',
  });

  return (
    <ark.section
      ref={pane.ref}
      data-slot="page-section"
      {...pane.dataAttributes}
      className={cn(pageSectionBase, className)}
      {...props}
    >
      {children}
    </ark.section>
  );
}
