import js from '@eslint/js';
import type { Linter } from 'eslint';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

const tsRecommendedTypeChecked = tsPlugin.configs[
  'flat/recommended-type-checked'
] as Linter.Config[];

export default [
  {
    ignores: ['dist/', 'coverage/', 'node_modules/', '*.config.ts'],
  },
  js.configs.recommended,
  ...tsRecommendedTypeChecked,
  {
    files: ['src/**/*.ts', 'examples/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Code quality (style is handled by Prettier)
      'no-console': 'warn',
      'no-debugger': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      // Relaxations
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['examples/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  prettierConfig,
] satisfies Linter.Config[];
