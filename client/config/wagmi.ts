import { personaConfig } from '@/config/persona.config';
import { isZoraMintingEnabled } from '@/config/persona.config';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks';
import { coinbaseWallet } from '@wagmi/connectors';
import { cookieStorage, createStorage } from '@wagmi/core';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId && isZoraMintingEnabled) {
  console.warn(
    'NEXT_PUBLIC_PROJECT_ID is not defined – Zora minting will be disabled. ' +
    'Set NEXT_PUBLIC_ENABLE_ZORA_MINTING=false to silence this warning.'
  );
}

export const networks = [base];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = isZoraMintingEnabled && projectId
  ? new WagmiAdapter({
      storage: createStorage({
        storage: cookieStorage,
      }),
      connectors: [
        /**
          we are intentionally using coinbase sdk v3 here 
          because v4 forces a reload on disconnect, 
          which resets our react app state
        */
        coinbaseWallet({
          reloadOnDisconnect: false,
          version: '3',
          appName: personaConfig.appName,
        }),
      ],
      ssr: true,
      projectId: projectId!,
      networks,
    })
  : (null as unknown as WagmiAdapter);

export const config = wagmiAdapter?.wagmiConfig;
