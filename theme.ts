'use client';

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'accent',
  colors: {
    brand: [
      '#ecf4ff', // brand[0] - Lightest
      '#dce4f5', // brand[1]
      '#b9c7e2', // brand[2]
      '#94a8d0', // brand[3]
      '#748dc0', // brand[4]
      '#5f7cb7', // brand[5] - Primary brand color
      '#5474b4', // brand[6]
      '#44639f', // brand[7]
      '#3a5890', // brand[8]
      '#2c4b80', // brand[9] - Darkest
    ],
    accent: [
      '#fff4e6', // accent[0] - Lightest
      '#ffe8cc', // accent[1]
      '#ffd8a8', // accent[2]
      '#ffc078', // accent[3]
      '#ffa94d', // accent[4] - Button color (primary usage)
      '#ff922b', // accent[5]
      '#fd7e14', // accent[6]
      '#f76707', // accent[7]
      '#e8590c', // accent[8]
      '#d9480f', // accent[9] - Darkest
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '700',
  },
  components: {
    Button: {
      defaultProps: {
        color: 'accent.7',
      },
    },
  },
});
