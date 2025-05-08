import { storeZoraCoin } from '@/api';
import { config as wagmiConfig } from '@/config/wagmi';
import { uploadToIPFS } from '@/helpers/ipfs';
import { ZoraCoinResult } from '@/types/agent';
import { useAppKit, useAppKitAccount, useAppKitState, useDisconnect } from '@reown/appkit/react';
import { getWalletClient } from '@wagmi/core';
import { createCoin } from '@zoralabs/coins-sdk';
import { useEffect, useRef, useState } from 'react';
import { Address, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

interface UseCoinOnZoraProps {
  roomId: string;
  title: string;
  description: string;
  base64Image: string | null;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
}

interface UseCoinOnZoraReturn {
  onClick: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  result: ZoraCoinResult | null;
}

enum ZoraCoinFlowStep {
  IDLE = 'idle',
  CONNECTING_WALLET = 'connecting_wallet',
  UPLOADING_IMAGE = 'uploading_image',
  CREATING_COIN = 'creating_coin',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

// todo: remove this (simulate success)
const test = false;

const useCoinOnZora = ({
  roomId,
  title,
  description,
  base64Image,
  onSuccess: successCallback,
  onFailure: failureCallback,
}: UseCoinOnZoraProps): UseCoinOnZoraReturn => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { open: isOpen, loading } = useAppKitState();

  const [currentStep, setCurrentStep] = useState<ZoraCoinFlowStep>(ZoraCoinFlowStep.IDLE);
  const zoraResult = useRef<ZoraCoinResult | null>(null);

  const { disconnect } = useDisconnect();

  //   image is not base64 encoded
  const isDisabled = typeof base64Image !== 'string';

  const onSuccess = (result: ZoraCoinResult) => {
    setCurrentStep(ZoraCoinFlowStep.SUCCESS);
    zoraResult.current = result;

    // store zora coin URL in DB (We store it to track all the created coins so that we can buy some of them later)
    storeZoraCoin(roomId, {
      wallet: address as Address,
      zoraResult: result,
    });

    // disconnect wallet
    disconnect();

    successCallback?.();
  };

  const onFailure = (error: Error) => {
    setCurrentStep(ZoraCoinFlowStep.FAILURE);
    console.error('Error creating coin on zora:', error);

    // disconnect wallet
    disconnect();

    failureCallback?.(error);
  };

  //   step 1: connect wallet
  const onClickHandler = () => {
    if (isConnected) {
      return;
    }

    setCurrentStep(ZoraCoinFlowStep.CONNECTING_WALLET);
    open({
      view: 'Connect',
    });
  };

  useEffect(() => {
    if (currentStep === ZoraCoinFlowStep.CONNECTING_WALLET && !isOpen) {
      // if the modal is not open, means user closed the modal
      setCurrentStep(ZoraCoinFlowStep.IDLE);
    }
  }, [isOpen]);

  const uploadImageToIPFS = async () => {
    if (!base64Image) {
      return;
    }

    // test cid ->
    // return 'bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy';

    return uploadToIPFS(title, description, base64Image);
  };

  const initiateZoraFlow = async (address: Address) => {
    if (test) {
      onSuccess({
        zoraLink: 'https://zora.co/coin/base:0x29bD2273DC8e865e045AFdeCC6B3c138a39A8f2E',
        coinAddress: '0x29bD2273DC8e865e045AFdeCC6B3c138a39A8f2E',
        hash: '0x29bD2273DC8e865e045AFdeCC6B3c138a39A8f2E',
      });

      return;
    }

    try {
      setCurrentStep(ZoraCoinFlowStep.UPLOADING_IMAGE);
      //   step 2: upload image to ipfs
      const cid = await uploadImageToIPFS();
      console.log('asset url', `https://api.devfolio.co/api/ipfs/${cid}`);

      //   step 3: create coin
      setCurrentStep(ZoraCoinFlowStep.CREATING_COIN);

      const coinParams = {
        name: title,
        symbol: title,
        uri: `ipfs://${cid}`,
        payoutRecipient: address,
      };

      const walletClient = await getWalletClient(wagmiConfig, { chainId: base.id });

      const publicClient = createPublicClient({
        chain: base,
        transport: http('https://base-rpc.publicnode.com'),
      });

      const result = await createCoin(coinParams, walletClient, publicClient);

      if (result.address) {
        const zoraLink = `https://zora.co/coin/base:${result.address}`;

        console.log('result', result);
        console.log('zoraLink', zoraLink);

        onSuccess({
          zoraLink,
          coinAddress: result.address,
          hash: result.hash,
        });
      }
    } catch (error) {
      onFailure(error as Error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      console.log('connected address: ', address);

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

  const isLoading = ![ZoraCoinFlowStep.IDLE, ZoraCoinFlowStep.SUCCESS, ZoraCoinFlowStep.FAILURE].includes(currentStep);

  console.log('currentStep: ', currentStep);

  return {
    onClick: onClickHandler,
    isDisabled,
    isLoading,
    result: currentStep === ZoraCoinFlowStep.SUCCESS ? zoraResult.current : null,
  };
};

export { useCoinOnZora };
