module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
  ],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'no-plusplus': 'off',
    'no-console': 'off',
  },
};
