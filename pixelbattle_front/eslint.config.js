import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**', '**/*.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'react-hooks': reactHooks, import: importPlugin },
    rules: {
      quotes: [2, 'single'],
      semi: [2, 'never'],
      'no-nested-ternary': 'error',
      'react/prop-types': 0,
      'react/display-name': 'off',
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/extensions': 0,
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 0,
    },
  },
]