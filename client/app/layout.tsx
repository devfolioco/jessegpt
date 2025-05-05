import AppKitContextProvider from '@/context/AppKitContext';
import '@livekit/components-styles';
import clsx from 'clsx';
import { headers } from 'next/headers';
import { inter } from './fonts/fonts';
import './globals.css';

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
