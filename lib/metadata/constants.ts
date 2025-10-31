import type { Metadata } from 'next';

// Site configuration
export const SITE_NAME = 'AI Training Course Survey';
export const SITE_DESCRIPTION =
  'Progressive web app for AI training course surveys with offline support';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Open Graph image configuration
export const OG_IMAGE = {
  url: '/images/featured-image-og.jpg',
  width: 1200,
  height: 630,
  alt: 'AI Training Course Survey - Share your feedback',
  type: 'image/jpeg' as const,
};

// Default metadata for all pages
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    'AI training',
    'course survey',
    'feedback',
    'progressive web app',
    'offline survey',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Survey',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [OG_IMAGE],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

// Helper function to generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  path = '',
  images,
}: {
  title?: string;
  description?: string;
  path?: string;
  images?: typeof OG_IMAGE;
}): Metadata {
  const pageUrl = `${SITE_URL}${path}`;
  const pageImages = images || OG_IMAGE;

  return {
    title,
    description: description || SITE_DESCRIPTION,
    openGraph: {
      title: title || SITE_NAME,
      description: description || SITE_DESCRIPTION,
      url: pageUrl,
      images: [pageImages],
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: title || SITE_NAME,
      description: description || SITE_DESCRIPTION,
      images: [pageImages.url],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}
