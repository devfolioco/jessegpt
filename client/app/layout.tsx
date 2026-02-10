import { personaConfig } from '@/config/persona.config';
import AppKitContextProvider from '@/context/AppKitContext';
import '@livekit/components-styles';
import { Analytics } from '@vercel/analytics/next';
import clsx from 'clsx';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { inter } from './fonts/fonts';
import './globals.css';

const title = `${personaConfig.appName} – ${personaConfig.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(personaConfig.siteUrl),
  title,
  description: personaConfig.description,
  openGraph: {
    type: 'website',
    url: './',
    title,
    description: personaConfig.description,
    images: personaConfig.ogImagePath,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: personaConfig.description,
    images: personaConfig.ogImagePath,
  },
  icons: {
    icon: [
      { url: personaConfig.favicon.gif, type: 'image/gif' },
      { url: personaConfig.favicon.ico, type: 'image/x-icon' },
    ],
    shortcut: { url: personaConfig.favicon.ico },
    apple: personaConfig.favicon.apple,
  },
  alternates: {
    canonical: personaConfig.siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en" className={'h-full'}>
      <body className={clsx('h-full', inter.variable)}>
        <AppKitContextProvider cookies={cookies}>{children}</AppKitContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
