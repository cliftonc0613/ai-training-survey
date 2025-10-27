import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '../theme';
import { UserProvider } from '@/lib/context/UserContext';
import { QuizProvider } from '@/lib/context/QuizContext';

export const metadata = {
  title: 'AI Training Course Survey',
  description: 'Progressive web app for AI training course surveys with offline support',
  manifest: '/manifest.json',
  themeColor: '#46597e',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Survey',
  },
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" zIndex={1000} />
          <UserProvider>
            <QuizProvider>{children}</QuizProvider>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
