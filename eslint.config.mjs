import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default ts.config(
  {
    // Reference clones, build output, generated assets, and docs prose.
    ignores: [
      '**/dist/**',
      '**/lib/**',
      '**/node_modules/**',
      '**/.changeset/**',
      'vuetify/**',
      'vuesax/**',
      'plans/**',
      '**/*.md',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // SFCs use the TS parser for <script lang="ts">.
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: ts.parser },
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  }
)
