import AppKitContextProvider from '@/context/AppKitContext';
import '@livekit/components-styles';
import { Public_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';

const publicSans400 = Public_Sans({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en" className={`h-full ${publicSans400.className}`}>
      <body className="h-full">
        <AppKitContextProvider cookies={cookies}>{children}</AppKitContextProvider>
      </body>
    </html>
  );
}
