import { ZoraCoinResult } from '@/types/agent';

export const storeZoraCoin = (
  roomId: string,
  { wallet, zoraResult }: { wallet: string; zoraResult: ZoraCoinResult }
) => {
  // Send the coin data to the server
  if (roomId) {
    fetch(`/api/jessegpt/conversations/${roomId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_address: wallet,
        coin_address: zoraResult.coinAddress,
        txn_hash: zoraResult.hash,
      }),
    })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to store Zora coin on server');
        }
      })
      .catch(error => {
        console.error('Error storing Zora coin:', error);
      });
  }
};
