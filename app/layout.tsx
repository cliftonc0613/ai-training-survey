import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { UserProvider } from '@/lib/context/UserContext';
import { QuizProvider } from '@/lib/context/QuizContext';

export const metadata = {
  title: 'AI Training Course Survey',
  description: 'Progressive web app for AI training course surveys with offline support',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <UserProvider>
            <QuizProvider>{children}</QuizProvider>
          </UserProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
