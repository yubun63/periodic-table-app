import { createTheme } from '@mantine/core';

interface ThemeOptions {
  primaryColor: string;
  borderRadius: string;
  compact: boolean;
}

export function createDynamicTheme({ primaryColor, borderRadius, compact }: ThemeOptions) {
  return createTheme({
    primaryColor,
    defaultRadius: borderRadius as any,
  });
}