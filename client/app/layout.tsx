import AppKitContextProvider from '@/context/AppKitContext';
import '@livekit/components-styles';
import clsx from 'clsx';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { inter } from './fonts/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(`https://jessegpt.xyz`),
  title: 'JesseGPT',
  description: "Talk to JesseXBT - Get feedback on your ideas from Base creator Jesse Pollak's AI avatar.",
  openGraph: {
    type: 'website',
    url: './',
    title: 'JesseGPT',
    description:
      "Get feedback on your ideas from Base creator Jesse Pollak's AI avatar. Choose between optimistic hype mode or brutally honest critique to level up your project.",
    images: '/og-image.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JesseGPT',
    description:
      "Get feedback on your ideas from Base creator Jesse Pollak's AI avatar. Choose between optimistic hype mode or brutally honest critique to level up your project.",
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
    canonical: './',
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
