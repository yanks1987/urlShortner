// backend/eslint.config.js
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

// Node.js and ES2021 globals
const nodeGlobals = require('globals').node;
const es2021Globals = require('globals').es2021;

module.exports = [
  // Base JS recommended rules
  js.configs.recommended,
  {
    ignores: ['node_modules', 'dist'],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...nodeGlobals,
        ...es2021Globals,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Add or override rules here
    },
  },
];