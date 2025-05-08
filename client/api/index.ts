import { ZoraCoinResult } from '@/types/agent';

// Devfolio API to store zora coin URL on server (We store it to track all the created coins so that we can buy some of them later)
export const storeZoraCoin = async (
  roomId: string,
  { wallet, zoraResult }: { wallet: string; zoraResult: ZoraCoinResult }
) => {
  try {
    await fetch(`https://api.devfolio.co/api/miscellaneous/jessegpt/conversations/${roomId}`, {
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
          console.log('Failed to store Zora coin on server');
        }
      })
      .catch(error => {
        console.log('Error storing Zora coin:', error);
      });
  } catch (error) {
    console.log('Error storing Zora coin:', error);
  }
};
