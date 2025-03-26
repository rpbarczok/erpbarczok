module.exports = {
    'node-option': ['import=tsx'],
    extension: ['ts', 'tsx'],
    jsx: 'react-jsxdev',
    spec: ['server/typescript/tests/**/*.ts', 'client/tests/**/*.tsx', 'client/tests/**/*.ts'],
    ignore: ['server/typescript/tests/utils/**/*'],
    require: [
      "global-jsdom/register",
      "ignore-styles"
  ]
  }