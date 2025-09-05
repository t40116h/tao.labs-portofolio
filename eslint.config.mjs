import { FlatCompat } from '@eslint/eslintrc';
import prettierConfig from 'eslint-config-prettier';
import path from 'path';
import { fileURLToPath } from 'url';
import tse from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default tse.config(
  ...compat.extends('next/core-web-vitals'),
  ...tse.configs.recommended,
  prettierConfig,
  {
    ignores: [
      '.next/',
      'node_modules/',
      'build/',
      'out/',
      'public/assets/',
      '.pnpm-store/',
    ],
  },
);
