import React, { PropsWithChildren } from 'react';
import ThemeProvider from './ThemeProvider';

import type { ThemeProviderProps } from 'next-themes/dist/types';
import { TooltipProvider } from '@components/ui/tooltip';
type Props = {
  themes: Omit<ThemeProviderProps, 'children'>;
};

export default function WrapperProvider({
  themes,
  children,
}: PropsWithChildren<Props>) {
  return (
    <ThemeProvider {...themes}>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
