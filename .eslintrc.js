module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'prefer-destructuring': 0,
    'vue/no-unused-components': 0,
    'arrow-parens': ['error', 'as-needed'],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
    }],
    'import/no-cycle': ['warn'],
    'func-names': ['error', 'never'],
    '@typescript-eslint/no-explicit-any': 0,
  },
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        'no-unused-vars': 'off',
        camelcase: 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', './src'],
        ],
        extensions: ['.js', '.vue', '.ts'],
      },
    },
  },
};
