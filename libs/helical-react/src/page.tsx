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
  cn,
} from '@cloudvoyant/helical-ui';

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

export type PageGutterProps = HTMLArkProps<'div'> & {
  side?: PageGutterVariants['side'];
  align?: PageGutterContentVariants['align'];
  contentClassName?: string;
};

export function PageGutter({
  side = 'left',
  align = 'start',
  contentClassName,
  className,
  children,
  ...props
}: PageGutterProps) {
  return (
    <ark.div data-slot="page-gutter-area" className={cn(pageGutterAreaBase, side === 'right' && '[grid-area:right]')}>
      <ark.div data-slot="page-gutter" className={cn(pageGutterVariants({ side }), className)} {...props}>
        <ark.div data-slot="page-gutter-content" className={cn(pageGutterContentVariants({ align }), contentClassName)}>
          {children}
        </ark.div>
      </ark.div>
    </ark.div>
  );
}

export function PageContent({ className, children, ...props }: HTMLArkProps<'main'>) {
  return (
    <ark.main data-slot="page-content" className={cn(pageContentBase, className)} {...props}>
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

export function PageSection({ className, children, ...props }: HTMLArkProps<'section'>) {
  return (
    <ark.section data-slot="page-section" className={cn(pageSectionBase, className)} {...props}>
      {children}
    </ark.section>
  );
}
