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

const tweetAndCastCopies = [
  `Pitched my project to JesseGPT.\n\nFeedback was half compliment, half therapy session.\n\nTry it here → jessegpt.com\n@devfolio`,
  `JesseGPT: “This sounds like an MVP you haven’t validated.”\n\nMe: “fair.”\n\nGood feedback engine by @devfolio.\nTry it here: jessegpt.com`,
  `Encouraging JesseGPT is like your cofounder on a good day.\n\nGentle roast. Useful advice.\n\nIf you’re building something, go vibe → jessegpt.com\n@devfolio`,
  `JesseGPT didn’t roast me.\n\nHe actually liked my idea 😳\n\nIf you’re looking for a confidence boost with real feedback, try the green Jesse → jessegpt.com\n@devfolio`,
  `Picked Critical Jesse on JesseGPT.\n\nGot cooked.\nLearned a lot.\nMight go cry a little.\n\nMade by @devfolio — jessegpt.com`,
];

export const getTweetCopy = ({ title, summary, zoraUrl }: { title: string; summary: string; zoraUrl: string }) => {
  const randomCopy = tweetAndCastCopies[Math.floor(Math.random() * tweetAndCastCopies.length)];
  return `
    ${randomCopy}
  `;
};

export const getFarcasterCopy = ({ title, summary, zoraUrl }: { title: string; summary: string; zoraUrl: string }) => {
  const randomCopy = tweetAndCastCopies[Math.floor(Math.random() * tweetAndCastCopies.length)];

  return `
    ${randomCopy}
  `;
};
