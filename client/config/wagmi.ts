import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks';
import { coinbaseWallet } from '@wagmi/connectors';
import { cookieStorage, createStorage } from '@wagmi/core';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const networks = [base];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    coinbaseWallet({
      reloadOnDisconnect: false,
      version: '3',
      appName: 'JesseGPT',
    }),
  ],
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
