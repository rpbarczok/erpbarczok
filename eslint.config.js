// @ts-check

import eslint from '@eslint/js';
import globals from "globals";
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'server/public/**/*', 
      'server/ecmascript/**/*', 
      'server/mocha-typescript-rc.cjs', 
      'server/mocha-ecmascript-rc.cjs', 
      'client/types/**/*',
      'client/mocha-typescript-rc.cjs',
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {    
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    }
  }
);