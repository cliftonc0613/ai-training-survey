import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import { UserProvider } from '@/lib/context/UserContext';
import { QuizProvider } from '@/lib/context/QuizContext';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { defaultMetadata } from '@/lib/metadata/constants';

export const metadata = defaultMetadata;

export const viewport = {
  themeColor: '#46597e',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Notifications position="top-right" zIndex={1000} />
          <ColorSchemeToggle />
          <UserProvider>
            <QuizProvider>{children}</QuizProvider>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
