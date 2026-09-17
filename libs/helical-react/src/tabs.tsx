// libs/helical-react/src/tabs.tsx
// Closely based on: Shark UI tabs (https://shark.vini.one/docs/components/tabs, @ark-ui/react/tabs)
import {
  TabsRoot,
  TabList,
  TabIndicator,
  TabTrigger,
  TabContent,
  useTabsContext,
  type TabsRootProps,
  type TabListProps,
  type TabTriggerProps,
  type TabContentProps,
} from '@ark-ui/react/tabs';
import {
  tabsRootBase,
  tabsListBase,
  tabsListVariants,
  tabsIndicatorBase,
  tabsIndicatorVariants,
  tabsTriggerBase,
  tabsContentBase,
  cn,
  type TabsListVariants,
} from '@cloudvoyant/helical-ui';

export type TabsProps = TabsRootProps;

export function Tabs({ className, lazyMount = true, unmountOnExit = true, ...props }: TabsProps) {
  return (
    <TabsRoot lazyMount={lazyMount} unmountOnExit={unmountOnExit} className={cn(tabsRootBase, className)} {...props} />
  );
}

export type TabsListProps = TabListProps & TabsListVariants;

export function TabsList({ variant = 'default', className, children, ...props }: TabsListProps) {
  return (
    <TabList className={cn(tabsListBase, tabsListVariants({ variant }), className)} {...props}>
      {children}
      <TabIndicator className={cn(tabsIndicatorBase, tabsIndicatorVariants({ variant }))} />
    </TabList>
  );
}

export type TabsTriggerProps = TabTriggerProps;

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return <TabTrigger className={cn(tabsTriggerBase, className)} {...props} />;
}

export type TabsContentProps = TabContentProps;

export function TabsContent({ className, ...props }: TabsContentProps) {
  return <TabContent className={cn(tabsContentBase, className)} {...props} />;
}

export const useTabs = useTabsContext;
