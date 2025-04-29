module.exports = {
  arrowParens: 'avoid',
  printWidth: 120,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  trailingComma: 'es5',
  endOfLine: 'auto',

  importOrder: ['<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
