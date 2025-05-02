'use client';

import { base, mainnet } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { type Config, WagmiProvider, cookieToInitialState } from 'wagmi';
import { projectId, wagmiAdapter } from '../config/wagmi';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'jessegpt',
  description: 'Talk to Jesse Poll',
  url: 'https://jessegpt.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

const featuredWalletIds = [
  // coinbase
  'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
];

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata: metadata,
  themeMode: 'dark',
  featuredWalletIds,

  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: false,
    receive: false,
    send: false,
    swaps: false,
  },
});

function AppKitContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitContextProvider;
