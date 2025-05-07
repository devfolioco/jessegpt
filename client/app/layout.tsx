import AppKitContextProvider from '@/context/AppKitContext';
import '@livekit/components-styles';
import clsx from 'clsx';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { inter } from './fonts/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(`https://jessegpt.xyz`),
  title: 'JesseGPT – Onchain Feedback That Pays Off',
  description:
    'An AI trained on Jesse Pollak to give you real feedback on your onchain idea. Part of the Base Batches #001 Global Buildathon. Powered by Base.',
  openGraph: {
    type: 'website',
    url: './',
    title: 'JesseGPT – Onchain Feedback That Pays Off',
    description:
      'An AI trained on Jesse Pollak to give you real feedback on your onchain idea. Part of the Base Batches #001 Global Buildathon. Powered by Base.',
    images: '/og-image.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JesseGPT – Onchain Feedback That Pays Off',
    description:
      'An AI trained on Jesse Pollak to give you real feedback on your onchain idea. Part of the Base Batches #001 Global Buildathon. Powered by Base.',
    images: '/og-image.png',
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon.gif', type: 'image/gif' },
      { url: '/favicon_io/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: { url: '/favicon_io/favicon.ico' },
    apple: '/favicon_io/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://www.jessegpt.xyz',
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
      </body>
    </html>
  );
}
