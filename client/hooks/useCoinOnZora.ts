import { storeZoraCoin } from '@/api';
import { config as wagmiConfig } from '@/config/wagmi';
import { uploadToIPFS } from '@/helpers/ipfs';
import { ZoraCoinFlowStep, ZoraCoinResult } from '@/types/agent';
import { useAppKit, useAppKitAccount, useAppKitState, useDisconnect } from '@reown/appkit/react';
import { getBalance, getWalletClient } from '@wagmi/core';
import { createCoin } from '@zoralabs/coins-sdk';
import { useEffect, useRef, useState } from 'react';
import { Address, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

interface UseCoinOnZoraProps {
  roomId: string;
  title: string;
  description: string;
  base64Image: string | null;
  onSuccess?: (result: ZoraCoinResult) => void;
  onFailure?: (error: Error) => void;
}

interface UseCoinOnZoraReturn {
  onClick: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  result: ZoraCoinResult | null;
  status: ZoraCoinFlowStep;
}

// only for testing: Enable this to simulate successful coin creation
const test = false;

/**
 * Custom hook for creating a coin on Zora.
 *
 * This hook manages the flow of creating a coin on Zora, including:
 * - Connecting a wallet
 * - Uploading image to IPFS
 * - Creating the coin on Zora
 * - Handling success and failure states
 *
 * @param {UseCoinOnZoraProps} props - Configuration for creating the coin
 * @param {string} props.roomId - Unique identifier for the room
 * @param {string} props.title - Idea Name
 * @param {string} props.description - Idea Summary
 * @param {string | null} props.base64Image - Base64 encoded image for the coin
 * @param {Function} [props.onSuccess] - Callback function called on successful coin creation
 * @param {Function} [props.onFailure] - Callback function called when coin creation fails
 *
 * @returns {UseCoinOnZoraReturn} Object containing coin creation state and controls
 */

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
  const { open: isOpen } = useAppKitState();

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

    successCallback?.(result);
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
      const balance = await getBalance(wagmiConfig, { address: address as Address });

      if (balance.value === BigInt(0) && balance.symbol === 'ETH') {
        setCurrentStep(ZoraCoinFlowStep.FAILURE);
        onFailure(new Error('Insufficient balance'));
        return;
      }

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

  return {
    onClick: onClickHandler,
    isDisabled,
    isLoading,
    result: currentStep === ZoraCoinFlowStep.SUCCESS ? zoraResult.current : null,
    status: currentStep,
  };
};

export { useCoinOnZora };
