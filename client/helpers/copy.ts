/**
 * Return the twitter intent URL for sharing
 * @ref https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
 * @param queryParams The params accepted by the twitter intent
 * @returns username of the user
 * */
export const getTwitterIntentURL = (queryParams: { url?: string; text?: string; via?: string; hashtags?: string }) => {
  const intentBaseURL = 'https://twitter.com/intent/tweet?';
  const params = new URLSearchParams(queryParams);
  return `${intentBaseURL}${params.toString()}`;
};

/**
 * Return the warpcast intent URL for sharing
 * @ref https://docs.farcaster.xyz/reference/warpcast/cast-composer-intents
 * @param queryParams The params accepted by the warpcast intent
 * @returns username of the user
 * */
export const getWarpcastIntentURL = (queryParams: { text?: string; 'embeds[]'?: string; channelKey?: string }) => {
  const intentBaseURL = 'https://warpcast.com/~/compose?';
  const params = new URLSearchParams(queryParams);
  return `${intentBaseURL}${params.toString()}`;
};

export const getTweetCopy = ({ title, summary, zoraUrl }: { title: string; summary: string; zoraUrl: string }) => {
  return `${title}
  
  ${summary}
  
  ${zoraUrl}
  `;
};

export const getFarcasterCopy = ({ title, summary, zoraUrl }: { title: string; summary: string; zoraUrl: string }) => {
  return `${title}
  
  ${summary}
  `;
};
