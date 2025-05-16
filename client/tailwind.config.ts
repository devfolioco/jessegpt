import type { Config } from 'tailwindcss';
import { colors } from './theme/colors';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
      screens: {
        xs: '300px',
        sm: '400px',
      },
    },
  },
  plugins: [],
};
export default config;
