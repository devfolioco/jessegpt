export const personaConfig = {
  // App identity
  appName: 'AustinGPT',
  tagline: 'Buidl Something. Ship It. Learn.',
  description:
    'An AI trained on Austin Griffith to give you real builder feedback on your project idea. Powered by Ethereum.',
  siteUrl: 'https://austingpt.xyz',
  blogUrl: 'https://austingriffith.com',

  // OG / SEO
  ogImagePath: '/og-image-1.1.png',
  favicon: {
    gif: '/favicon_io/favicon.gif',
    ico: '/favicon_io/favicon.ico',
    apple: '/favicon_io/apple-touch-icon.png',
  },

  // Landing page
  heroTitle: 'Talk to AustinGPT',
  heroDescription: 'Talk to Austin\'s AI avatar about your project idea and coin it on Zora.',
  heroAvatarImage: '/original.gif',
  heroAvatarAlt: 'AustinGPT Avatar',
  startChatButtonLabel: 'Start talking to Austin',

  // Footer
  footer: {
    credit: 'Devfolio',
    creditUrl: 'https://devfolio.co',
    socialLinks: [
      { label: 'Twitter / X', url: 'https://twitter.com/devfolio' },
      { label: 'Farcaster', url: 'https://warpcast.com/devfolio' },
      { label: 'View Project', url: 'https://devfolio.co/projects/jessegpt-2acd' },
    ],
    githubRepo: 'https://github.com/devfolioco/jessegpt',
  },

  // Moods / personas
  moods: {
    excited: {
      label: 'AustinGPT',
      subtitle: 'The enthusiastic builder mentor.',
      description:
        'Sees a buidler in everyone, bursting with hackathon energy, & ready to help you ship your first prototype.',
      avatarImage: '/mellow-austin.gif',
      accentClass: 'bg-optimism text-black',
      visualizerVariant: 'optimism' as const,
      visualizerBgColor: '#FFF68D',
      connectingLabel: 'AustinGPT (Enthusiastic)',
    },
    critical: {
      label: 'Tough Love AustinGPT',
      subtitle: 'The tough-love builder mentor.',
      description:
        'Demands you understand the fundamentals, challenges every abstraction, & believes great builders explain things simply.',
      avatarImage: '/critical-austin.gif',
      accentClass: 'bg-critical text-white',
      visualizerVariant: 'critical' as const,
      visualizerBgColor: '#0157FA',
      connectingLabel: 'Tough Love AustinGPT (Critical)',
    },
  },

  // Social share copy templates
  shareCopies: [
    `Pitched my project to AustinGPT.\n\n"Have you tried building it yet?"\n\nFair point.\n\nTry it here \u2192 austingpt.xyz\n@devfolio`,
    `AustinGPT: "What does the simplest version look like?"\n\nMe: "...good question."\n\nGreat builder feedback.\nTry it: austingpt.xyz`,
    `Encouraging AustinGPT is like having a hackathon mentor on demand.\n\nPractical advice. Builder energy.\n\nGo vibe \u2192 austingpt.xyz\n@devfolio`,
    `AustinGPT loved my idea.\n\nNow I have to actually build it.\n\nIf you need builder feedback, try it \u2192 austingpt.xyz\n@devfolio`,
    `Picked Tough Love Austin on AustinGPT.\n\nGot asked "but why does this need a blockchain?"\n\nOuch. But fair.\n\naustingpt.xyz`,
  ],

  shareCopiesWithZora: [
    `Ran my idea through AustinGPT.\nCame out with a plan to build.\n\nMinted this for the record \u2192 {{zora_link}}\n\n@devfolio\n\naustingpt.xyz`,
    `Talked to AustinGPT.\nKept the receipts.\n\nMinted \u2192 {{zora_link}}\n\n@devfolio\n\naustingpt.xyz`,
    `AustinGPT said "just build it."\nSo I'm minting the proof.\n\n\u2192 {{zora_link}}\n\n@devfolio\n\naustingpt.xyz`,
  ],

  // Wallet metadata (for Reown AppKit)
  walletMetadata: {
    name: 'austingpt',
    description: 'Talk to Austin Griffith',
    url: 'https://austingpt.xyz',
    icons: ['https://avatars.githubusercontent.com/u/2653167'],
  },

  // Share frame
  shareFrame: {
    title: 'Ethereum',
    subtitle: 'is for',
    excitedAvatarImage: '/frame/austin-t-excited.png',
    criticalAvatarImage: '/frame/austin-t-critical.png',
  },
};

export type PersonaConfig = typeof personaConfig;
export type MoodKey = keyof typeof personaConfig.moods;

export const isZoraMintingEnabled = process.env.NEXT_PUBLIC_ENABLE_ZORA_MINTING !== 'false';
