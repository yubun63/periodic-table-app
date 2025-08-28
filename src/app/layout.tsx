'use client';

import { useEffect, useMemo } from 'react';

import {
  ColorSchemeScript,
  MantineProvider,
  MantineTheme,
} from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Open_Sans } from 'next/font/google';

import {
  COLOR_SCHEMES,
  ThemeCustomizerProvider,
  useThemeCustomizer,
} from '@/contexts/theme-customizer';
import { MainLayout } from '@/layouts/Main';
import { createDynamicTheme } from '@/theme';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/dropzone/styles.css';
import '@mantine/charts/styles.css';
import './globals.css';

// If loading a variable font, you don't need to specify the font weight
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

// Component that provides the dynamic theme
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { config } = useThemeCustomizer();

  // Create dynamic theme based on current config
  const dynamicTheme = useMemo(() => {
    return createDynamicTheme({
      primaryColor: config.appearance.primaryColor,
      borderRadius: config.appearance.borderRadius,
      compact: config.appearance.compact,
    });
  }, [
    config.appearance.primaryColor,
    config.appearance.borderRadius,
    config.appearance.compact,
  ]);

  // Update CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement;

    // Set primary color CSS variables
    const primaryColor = COLOR_SCHEMES[config.appearance.primaryColor];
    root.style.setProperty('--theme-primary-color', primaryColor.color);

    // Set border radius
    const radiusMap = {
      xs: '0.125rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    };
    root.style.setProperty(
      '--theme-border-radius',
      radiusMap[config.appearance.borderRadius],
    );

    // Set spacing scale for compact mode
    const spacingScale = config.appearance.compact ? '0.8' : '1';
    root.style.setProperty('--theme-spacing-scale', spacingScale);

    // Set compact mode flag
    root.style.setProperty(
      '--theme-compact',
      config.appearance.compact ? '1' : '0',
    );

    // Additional CSS variables for layout
    root.style.setProperty(
      '--sidebar-width',
      `${config.layout.sidebar.width}px`,
    );
    root.style.setProperty(
      '--header-height',
      `${config.layout.header.height}px`,
    );
  }, [config]);

  return (
    <MantineProvider
      theme={dynamicTheme}
      defaultColorScheme={config.appearance.colorScheme}
    >
      <DatesProvider
        settings={{
          firstDayOfWeek: 0,
          weekendDays: [0],
          timezone: 'UTC',
        }}
      >
        <Notifications position="bottom-right" zIndex={1000} />
        <ModalsProvider>
          <MainLayout>{children}</MainLayout>
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={openSans.className}>
      <head>
        <title>元素週期表 - 互動式化學元素探索</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="探索互動式元素週期表，點擊任何元素即可查看詳細的化學和物理性質。包含118個化學元素的完整資訊，包括原子結構、發現歷史、物理性質和化學特性。適合學生、教師和化學愛好者使用的教育工具。"
        />

        <script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        ></script>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <ThemeCustomizerProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ThemeCustomizerProvider>
      </body>
    </html>
  );
}