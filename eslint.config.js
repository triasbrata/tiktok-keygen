module.export = [
  {
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    files: ['./src/**/*.ts', './src/**/*.tsx'],
    ignores: ['.webpack'],
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parser: '@typescript-eslint/parser',
    settings: {
      react: {
        version: 'latest',
      },
    },
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
