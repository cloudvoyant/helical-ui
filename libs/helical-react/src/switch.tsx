// libs/helical-react/src/switch.tsx
// Closely based on: Shark UI switch (@ark-ui/react/switch)
import { createContext, useContext } from 'react';
import {
  SwitchRoot as ArkSwitchRoot,
  SwitchControl as ArkSwitchControl,
  SwitchThumb as ArkSwitchThumb,
  SwitchLabel as ArkSwitchLabel,
  SwitchHiddenInput as ArkSwitchHiddenInput,
  useSwitchContext,
  type SwitchRootProps,
} from '@ark-ui/react/switch';
import type { SwitchControlProps, SwitchThumbProps, SwitchLabelProps } from '@ark-ui/react/switch';
import { switchVariants, switchControlBase, switchThumbBase, switchLabelBase, cn } from '@cloudvoyant/helical-ui';
import type { SwitchProps as SwitchBaseProps } from '@cloudvoyant/helical-ui';

export type SwitchProps = SwitchRootProps & SwitchBaseProps;

const SwitchSizeContext = createContext<SwitchBaseProps['size']>('md');

export function Switch({ className, size = 'md', children, ...props }: SwitchProps) {
  return (
    <SwitchSizeContext.Provider value={size}>
      <ArkSwitchRoot className={cn('flex items-center gap-2', className)} {...props}>
        {children}
        <ArkSwitchHiddenInput />
      </ArkSwitchRoot>
    </SwitchSizeContext.Provider>
  );
}

export function SwitchControl({ className, ...props }: SwitchControlProps) {
  const size = useContext(SwitchSizeContext);
  return <ArkSwitchControl className={cn(switchVariants({ size }), switchControlBase, className)} {...props} />;
}

export function SwitchThumb({ className, ...props }: SwitchThumbProps) {
  return <ArkSwitchThumb className={cn(switchThumbBase, className)} {...props} />;
}

export function SwitchLabel({ className, ...props }: SwitchLabelProps) {
  return <ArkSwitchLabel className={cn(switchLabelBase, className)} {...props} />;
}

export const useSwitch = useSwitchContext;

export type { SwitchControlProps, SwitchThumbProps, SwitchLabelProps };
