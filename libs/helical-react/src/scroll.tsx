// libs/helical-react/src/scroll.tsx
// Closely based on: @ark-ui/react/scroll-area (Ark UI), Chakra UI ScrollArea
import {
  ScrollAreaRoot as ArkRoot,
  ScrollAreaViewport as ArkViewport,
  ScrollAreaContent as ArkContent,
  ScrollAreaScrollbar as ArkScrollbar,
  ScrollAreaThumb as ArkThumb,
  ScrollAreaCorner as ArkCorner,
  type ScrollAreaRootProps,
} from '@ark-ui/react/scroll-area';
import {
  scrollRootBase,
  scrollViewportBase,
  scrollContentBase,
  scrollScrollbarBase,
  scrollThumbBase,
  scrollCornerBase,
  cn,
} from '@cloudvoyant/helical-ui';

export type ScrollProps = ScrollAreaRootProps & {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** `default` shows the styled scrollbars; `hidden` keeps scrolling without rendering any scrollbar. */
  variant?: 'default' | 'hidden';
  contentClassName?: string;
  thumbClassName?: string;
  /** Overrides the viewport class. The default is `flex h-full w-full flex-col`;
   * for horizontal scrolling wrap content in a flex row or override this. */
  viewportClassName?: string;
};

export function Scroll({
  className,
  orientation = 'vertical',
  variant = 'default',
  contentClassName,
  thumbClassName,
  viewportClassName,
  children,
  ...props
}: ScrollProps) {
  return (
    <ArkRoot className={cn(scrollRootBase, className)} {...props}>
      <ArkViewport className={cn(scrollViewportBase, viewportClassName)}>
        <ArkContent className={cn(scrollContentBase, contentClassName)}>{children}</ArkContent>
      </ArkViewport>
      {variant === 'hidden' ? null : (
        <>
          {(orientation === 'vertical' || orientation === 'both') && (
            <ArkScrollbar orientation="vertical" className={scrollScrollbarBase}>
              <ArkThumb className={cn(scrollThumbBase, thumbClassName)} />
            </ArkScrollbar>
          )}
          {(orientation === 'horizontal' || orientation === 'both') && (
            <ArkScrollbar orientation="horizontal" className={scrollScrollbarBase}>
              <ArkThumb className={cn(scrollThumbBase, thumbClassName)} />
            </ArkScrollbar>
          )}
          {orientation === 'both' && <ArkCorner className={scrollCornerBase} />}
        </>
      )}
    </ArkRoot>
  );
}
