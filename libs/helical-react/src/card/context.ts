// libs/helical-react/src/card/context.ts
import { createContext, useContext } from 'react';

export type CardOrientation = 'vertical' | 'horizontal';

export const CardOrientationContext = createContext<CardOrientation>('vertical');

export function useCardOrientation() {
  return useContext(CardOrientationContext);
}
