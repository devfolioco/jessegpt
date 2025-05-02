import { uploadToIPFS } from '@/helpers/ipfs';
import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react';
import { getAccount } from '@wagmi/core';
import { createCoin, createCoinCall } from '@zoralabs/coins-sdk';
import { useEffect } from 'react';
import { Address, createPublicClient, createWalletClient, custom, http } from 'viem';
import { toAccount } from 'viem/accounts';
import { base } from 'viem/chains';

interface UseCoinOnZoraProps {
  title: string;
  description: string;
  base64Image: string | null;
}

interface UseCoinOnZoraReturn {
  onClick: () => void;
  isDisabled: boolean;
}

const useCoinOnZora = ({ title, description, base64Image }: UseCoinOnZoraProps): UseCoinOnZoraReturn => {
  const { open } = useAppKit();
  const { address, isConnected, allAccounts } = useAppKitAccount();
  const { switchNetwork, chainId, caipNetwork } = useAppKitNetwork();

  //   allAccounts[0];
  const { disconnect } = useDisconnect();

  //   image is not base64 encoded
  const isDisabled = typeof base64Image !== 'string';

  const onSuccess = () => {
    // disconnect wallet
    disconnect();
  };

  const onFailure = () => {
    // disconnect wallet
    disconnect();
  };

  //   step 1: connect wallet
  const onClickHandler = () => {
    if (isConnected) {
      return;
    }

    open({
      view: 'Connect',
    });
  };

  //   step 2: upload image to ipfs
  const uploadImageToIPFS = async () => {
    if (!base64Image) {
      return;
    }

    return 'QmU2gomJzpwDJHwiCpfD6YZzty6PmuZiRBgqWJtogE5ncb';

    return uploadToIPFS(title, description, base64Image);
  };

  const initiateZoraFlow = async (address: Address) => {
    // console.log(switchNetwork, chainId, caipNetwork);

    //   upload image to ipfs
    const cid = await uploadImageToIPFS();
    console.log(cid);
    console.log('url', `https://api.devfolio.co/api/ipfs/${cid}`);

    if (!window.ethereum) {
      console.log('ethereum wallet not found');
      return;
    }

    const account = toAccount(address);

    const walletClient = createWalletClient({
      account: account,
      chain: base,
      transport: http('https://base-rpc.publicnode.com'),
      //   transport: http('https://base-rpc.publicnode.com'),
    });

    // const addresses = await walletClient.requestAddresses();
    // console.log('addresses', addresses);

    const coinParams = {
      name: title,
      symbol: 'DEVFOLIO',
      uri: `ipfs://${cid}`,
      payoutRecipient: address,
      account: address,

      //   initialPurchaseWei: 0n, // Optional: Initial amount to purchase in Wei
    };

    try {
      // Create write config for the contract call
      const callConfig = await createCoinCall(coinParams);

      // Get public client for simulation (optional but good practice)
      // Set up Viem clients
      const publicClient = createPublicClient({
        chain: base,
        //   transport: custom(window.ethereum),
        transport: http('https://base-rpc.publicnode.com'),
      });

      //   const result = await createCoin(coinParams, walletClient, publicClient);
      //   console.log('result', result);

      //   // Simulate to get prepared config (optional but safe)
      const { request, result } = await publicClient.simulateContract({
        ...callConfig,
        // account,
      });

      console.log(request, result);

      // Create wallet client
      //   const walletClient = createWalletClient({
      //     account,
      //     chain: sepolia,
      //     transport: custom(window.ethereum), // or use HTTP transport for backend
      //   });

      // Send the transaction
      //   const txHash = await walletClient.writeContract(request);
      //   console.log('Deployment TX Hash:', txHash);
      //   return txHash;
    } catch (error) {
      console.error('Deployment failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      console.log(address);

      //   initiate the zora flow
      initiateZoraFlow(address as Address);

      // Handle tab close to disconnect wallet
      const handleBeforeUnload = () => {
        disconnect();
      };

      // disconnect on tab close
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);

        // disconnect on modal unmount
        disconnect();
      };
    }
  }, [isConnected]);

  return { onClick: onClickHandler, isDisabled };
};

export { useCoinOnZora };
