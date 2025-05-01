import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useEffect } from 'react';

interface UseCoinOnZoraProps {
  //
}

interface UseCoinOnZoraReturn {
  onClick: () => void;
}

const useCoinOnZora = ({}: UseCoinOnZoraProps = {}): UseCoinOnZoraReturn => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const onSuccess = () => {
    // disconnect wallet
    disconnect();
  };

  const onFailure = () => {
    // disconnect wallet
    disconnect();
  };

  const onClickHandler = () => {
    if (isConnected) {
      return;
    }

    open({
      view: 'Connect',
    });
  };

  useEffect(() => {
    if (isConnected) {
      console.log(address);
      //   initiate the zora flow

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

  return { onClick: onClickHandler };
};

export { useCoinOnZora };
