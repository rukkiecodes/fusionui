import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default ts.config(
  {
    // Reference clones, build output, generated assets, and docs prose.
    ignores: [
      '**/dist/**',
      '**/lib/**',
      '**/node_modules/**',
      '**/.changeset/**',
      'extras/**',
      'plans/**',
      '**/*.md',
      // Generated Feather icon modules
      'packages/icons/src/icons/**',
      'packages/icons/src/registry.ts',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      // Framework-internal plumbing (generic component/prop factories, directive
      // element augmentation) legitimately needs `any`. Mirrors Vuetify.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // TSX files legitimately declare several render-function components.
      'vue/one-component-per-file': 'off',
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
  },
  {
    // Docs example snippets are intentionally single-purpose SFCs.
    files: ['apps/docs/**/*.vue', '**/examples/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      // Slot names with dots (e.g. #item.score) are a valid table-cell pattern.
      'vue/valid-v-slot': 'off',
    },
  },
  // Must be last: turns off rules that conflict with Prettier formatting.
  prettier
)
