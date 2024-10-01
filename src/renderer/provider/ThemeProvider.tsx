import type { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as BaseProvider } from 'next-themes';
import React from 'react';

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <BaseProvider {...props}>{children}</BaseProvider>;
}
