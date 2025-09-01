// @ts-check

import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using modern APIs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default tseslint.config(
  ...compat.extends(
    'airbnb',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
  ),

  {
    ignores: [
      'dist/',
      'node_modules/',
      '.next/',
      'eslint.config.mjs', // We don't want to lint the config file itself
    ],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
  },
  // Main rule section
  {
    rules: {
      // original rules
      'react/no-unescaped-entities': 'off',
      'prettier/prettier': 'warn',
      'no-undef': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-unused-vars': 'off', // covered by TS
      'no-console': 'off',
      'class-methods-use-this': 'off',
      'import/no-unresolved': 'off', // handled by TS
      'import/no-absolute-path': 'off',
      'consistent-return': 'off',
      'no-underscore-dangle': 'off',
      'no-nested-ternary': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/prefer-default-export': 'off',
      '@typescript-eslint/return-await': 'off',
      'react/require-default-props': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/function-component-definition': [
        2,
        { namedComponents: 'arrow-function' },
      ],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      'jsx-a11y/no-static-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
          allowExpressionValues: true,
        },
      ],
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
    },
  },

  // Settings can be placed in a shared config object
  {
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
);
