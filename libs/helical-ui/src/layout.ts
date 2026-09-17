// libs/helical-ui/src/layout.ts
// Closely based on: Chakra UI layout primitives (Container, Stack/HStack/VStack) plus
// Row/Col flex aliases — shadcn/Tailwind base classes. No variant axes:
// customization is via className, applied last through cn.

export const containerBase = 'relative mx-auto w-full max-w-[90rem] px-4 md:px-6 lg:px-8';

export const rowBase = 'flex flex-row';

export const colBase = 'flex flex-col';

export const stackBase = 'flex flex-col gap-1';

export const hstackBase = 'flex flex-row gap-1';

export const vstackBase = 'flex flex-col gap-1';

export const centerBase = 'flex items-center justify-center';
