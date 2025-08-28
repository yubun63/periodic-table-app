'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MantineColorScheme } from '@mantine/core';

export interface ColorScheme {
  name: string;
  color: string;
}

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  blue: { name: 'Blue', color: '#228be6' },
  red: { name: 'Red', color: '#fa5252' },
  green: { name: 'Green', color: '#40c057' },
  yellow: { name: 'Yellow', color: '#fab005' },
  pink: { name: 'Pink', color: '#e64980' },
  grape: { name: 'Grape', color: '#9c88ff' },
  violet: { name: 'Violet', color: '#7950f2' },
  indigo: { name: 'Indigo', color: '#4c6ef5' },
  cyan: { name: 'Cyan', color: '#15aabf' },
  teal: { name: 'Teal', color: '#12b886' },
  lime: { name: 'Lime', color: '#82c91e' },
  orange: { name: 'Orange', color: '#fd7e14' },
};

export interface ThemeConfig {
  appearance: {
    primaryColor: keyof typeof COLOR_SCHEMES;
    colorScheme: MantineColorScheme;
    borderRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    compact: boolean;
  };
  layout: {
    sidebar: {
      width: number;
      collapsed: boolean;
    };
    header: {
      height: number;
    };
  };
}

const defaultConfig: ThemeConfig = {
  appearance: {
    primaryColor: 'blue',
    colorScheme: 'auto',
    borderRadius: 'sm',
    compact: false,
  },
  layout: {
    sidebar: {
      width: 300,
      collapsed: false,
    },
    header: {
      height: 60,
    },
  },
};

interface ThemeCustomizerContextType {
  config: ThemeConfig;
  updateConfig: (updates: Partial<ThemeConfig>) => void;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextType | undefined>(undefined);

export function ThemeCustomizerProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);

  const updateConfig = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      appearance: { ...prev.appearance, ...updates.appearance },
      layout: { 
        ...prev.layout, 
        ...updates.layout,
        sidebar: { ...prev.layout.sidebar, ...updates.layout?.sidebar },
        header: { ...prev.layout.header, ...updates.layout?.header },
      },
    }));
  };

  return (
    <ThemeCustomizerContext.Provider value={{ config, updateConfig }}>
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export function useThemeCustomizer() {
  const context = useContext(ThemeCustomizerContext);
  if (context === undefined) {
    throw new Error('useThemeCustomizer must be used within a ThemeCustomizerProvider');
  }
  return context;
}