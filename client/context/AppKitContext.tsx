'use client';

import { personaConfig } from '@/config/persona.config';
import { isZoraMintingEnabled } from '@/config/persona.config';
import { base } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode } from 'react';
import { type Config, WagmiProvider, cookieToInitialState } from 'wagmi';
import { projectId, wagmiAdapter } from '../config/wagmi';

// Set up queryClient
const queryClient = new QueryClient();

const mintingReady = isZoraMintingEnabled && !!projectId && !!wagmiAdapter;

if (mintingReady) {
  const featuredWalletIds = [
    // coinbase
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
  ];

  // Create the modal
  createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId!,
    networks: [base],
    defaultNetwork: base,
    metadata: personaConfig.walletMetadata,
    themeMode: 'dark',
    featuredWalletIds,

    features: {
      analytics: true,
      email: false,
      socials: false,
      receive: false,
      send: false,
      swaps: false,
    },
  });
}

function AppKitContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  if (!mintingReady) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitContextProvider;
