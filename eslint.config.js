// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  extends: [
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier & eslint-config-prettier
  ],
  rules: {
    semi: ['error', 'never'], // Disallow semicolons
    'prettier/prettier': 'error', // Treat Prettier formatting issues as ESLint errors
  },
})
