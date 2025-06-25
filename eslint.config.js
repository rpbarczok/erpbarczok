// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint'
import mochaPlugin from 'eslint-plugin-mocha'

export default tseslint.config(
  {
    ignores: [
      'eslint.config.js',
      'webpack.*',
      'server/mocha-ecmascript-rc.cjs',
      'server/mocha-typescript-rc.cjs',
      'server/ecmascript/**/*',
      'server/public/**/*',
      'node_modules/**/*',
      'create-openapi-spec.ts',
      'client/public/**/*',
      'client/types/**/*',
      'client/mocha-typescript-rc.cjs',
    ]
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  mochaPlugin.configs.flat.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksConditionals: true,
          checksSpreads: true,
          checksVoidReturn: false,
        }
      ],
      '@typescript-eslint/no-confusing-void-expression': ['error', {'ignoreArrowShorthand': true}],
      '@typescript-eslint/dot-notation': 'off'
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    }
  }
)