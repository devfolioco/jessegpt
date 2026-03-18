export const personaConfig = {
  // App identity
  appName: 'JesseGPT',
  tagline: 'Onchain Feedback That Pays Off',
  description:
    'An AI trained on Jesse Pollak to give you real feedback on your onchain idea. Part of the Base Batches #001 Global Buildathon. Powered by Base.',
  siteUrl: 'https://jessegpt.xyz',
  blogUrl: 'https://devfolio.co/blog/jessegpt/',

  // OG / SEO
  ogImagePath: '/og-image-1.1.png',
  favicon: {
    gif: '/favicon_io/favicon.gif',
    ico: '/favicon_io/favicon.ico',
    apple: '/favicon_io/apple-touch-icon.png',
  },

  // Landing page
  heroTitle: 'Talk to JesseGPT',
  heroDescription: 'Talk to Jesse\'s AI avatar about your project idea and coin it on Zora.',
  heroAvatarImage: '/original.gif',
  heroAvatarAlt: 'JesseGPT Avatar',
  startChatButtonLabel: 'Start talking to Jesse',

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
      label: 'JesseGPT',
      subtitle: 'The relentlessly optimistic Jesse Pollak.',
      description:
        'Sees massive potential everywhere, bursting with Onchain Summer energy, & ready to hype your vision to the moon.',
      avatarImage: '/mellow-jesse.gif',
      accentClass: 'bg-optimism text-black',
      visualizerVariant: 'optimism' as const,
      visualizerBgColor: '#FFF68D',
      connectingLabel: 'JesseGPT (Optimistic)',
    },
    critical: {
      label: 'SupaBald JesseGPT',
      subtitle: 'The brutally honest Jesse Pollak.',
      description:
        'Cuts through the hype, challenges every premise, & believes great ideas must survive intense scrutiny to succeed.',
      avatarImage: '/critical-jesse.gif',
      accentClass: 'bg-critical text-white',
      visualizerVariant: 'critical' as const,
      visualizerBgColor: '#0157FA',
      connectingLabel: 'SupaBald JesseGPT (Critical)',
    },
  },

  // Social share copy templates
  shareCopies: [
    `Pitched my project to JesseGPT.\n\nFeedback was half compliment, half therapy session.\n\nTry it here → jessegpt.com\n@devfolio`,
    `JesseGPT: "This sounds like an MVP you haven't validated."\n\nMe: "fair."\n\nGood feedback engine by @devfolio.\nTry it here: jessegpt.com`,
    `Encouraging JesseGPT is like your cofounder on a good day.\n\nGentle roast. Useful advice.\n\nIf you're building something, go vibe → jessegpt.com\n@devfolio`,
    `JesseGPT didn't roast me.\n\nHe actually liked my idea 😳\n\nIf you're looking for a confidence boost with real feedback, try the green Jesse → jessegpt.com\n@devfolio`,
    `Picked Critical Jesse on JesseGPT.\n\nGot cooked.\nLearned a lot.\nMight go cry a little.\n\nMade by @devfolio — jessegpt.com`,
  ],

  shareCopiesWithZora: [
    `Ran my idea through JesseGPT.\nCame out stronger.\n\nMinted this for the record → {{zora_link}}\n\n@devfolio\n\njessegpt.xyz`,
    `Talked to JesseGPT.\nKept the receipts.\n\nMinted → {{zora_link}}\n\n@devfolio\n\njessegpt.xyz`,
    `JesseGPT didn't love it.\nThat doesn't mean I'm not shipping.\n\nLogged this moment → {{zora_link}}\n\n@devfolio\n\njessegpt.xyz`,
  ],

  // Wallet metadata (for Reown AppKit)
  walletMetadata: {
    name: 'jessegpt',
    description: 'Talk to Jesse Pollak',
    url: 'https://jessegpt.xyz',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },

  // Share frame
  shareFrame: {
    title: 'Base',
    subtitle: 'is for',
    excitedAvatarImage: '/frame/jesse-t-excited.png',
    criticalAvatarImage: '/frame/jesse-t-critical.png',
  },
};

export type PersonaConfig = typeof personaConfig;
export type MoodKey = keyof typeof personaConfig.moods;

export const isZoraMintingEnabled = process.env.NEXT_PUBLIC_ENABLE_ZORA_MINTING !== 'false';
