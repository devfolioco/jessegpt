const colors = {
  // project theme colors
  optimism: '#FFF68E',
  brutal: '#0157FA',
  danger: '#F06444',
  secondary: '#2D2D2D',

  // social colors
  farcaster: '#6F57B4',
  x: '#07131A',
  zora: '#FFF',
  devfolio: '#3770FF',
  github: '#181717',
  lens: '#000000',
  twitch: '#9146FF',

  // source colors
  black: '#07131A',
  blue: {
    0: '#F0F4FF',
    1: '#D2E0FF',
    2: '#B3CEFF',
    3: '#8097F2',
    4: '#3770FF',
    '4b': '#2368FB',
    5: '#143BE2',
    6: '#0216BD',
    7: '#00068E',
    8: '#00005C',
  },
  gold: {
    DEFAULT: '#D7BE82', // deprecated
    0: '#E9DBB9',
    1: '#E3D1A6',
    2: '#D7BE82',
    3: '#C99E54',
    4: '#C39341',
    5: '#A0762C',
    6: '#7E662A',
    7: '#604D1F',
    8: '#322810',
  },
  grey: {
    0: '#FCFCFC',
    1: '#F5F7F7',
    2: '#F0F5F5',
    '2b': '#ECF0F1',
    3: '#E4EAEB',
    4: '#D0D9DA',
    5: '#B4BEC0',
    6: '#8E989C',
    7: '#5C686D',
    '7b': '#38474E',
    8: '#273339',
    9: '#20282D',
    10: '#171D21',
  },
  red: {
    0: '#FFF0F0',
    1: '#FED0CF',
    2: '#FDB4AE',
    3: '#F88472',
    4: '#F06444',
    5: '#E34E24',
    6: '#D23F10',
    7: '#BC3405',
    8: '#A32C00',
  },
  teal: {
    0: '#F0FFF9',
    1: '#CFFEED',
    2: '#AFFCE3',
    3: '#72F3D1',
    4: '#43E0BF',
    5: '#22C5A8',
    6: '#0FA38D',
    7: '#067F6E',
    8: '#025C50',
  },
  white: '#FFFFFF',
  yellow: {
    0: '#FFFFF0',
    1: '#FFFFA4',
    2: '#FFFE56',
    3: '#FFF116',
    4: '#FFDA00',
    5: '#F1BB00',
    6: '#E49700',
    7: '#DC7400',
    8: '#D65600',
  },
  prizes: {
    gold: '#B59343',
  },
} as const;

type GetColorNames<T, Prefix extends string = ''> = T extends string
  ? Prefix
  : {
      [K in keyof T]: K extends string | number
        ? T[K] extends string
          ? // If the key is exactly "DEFAULT", return the current prefix (the parent's name)
            K extends 'DEFAULT'
            ? Prefix
            : Prefix extends ''
              ? `${K}`
              : `${Prefix}-${K}`
          : GetColorNames<T[K], K extends 'DEFAULT' ? Prefix : Prefix extends '' ? `${K}` : `${Prefix}-${K}`>
        : never;
    }[keyof T];

// The final union type with names such as "grey-1", "blue-0", "white", etc.
export type Color = GetColorNames<typeof colors>;

export { colors };
