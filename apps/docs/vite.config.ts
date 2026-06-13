import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'unplugin-vue-markdown/vite'
import Pages from 'vite-plugin-pages'
import anchor from 'markdown-it-anchor'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  // Served under a sub-path on GitHub Pages (set by the deploy workflow).
  base: process.env.DOCS_BASE ?? '/',
  resolve: {
    alias: [
      // Resolve the library to its SOURCE so editing packages/vue/src
      // hot-reloads live in the docs (the "build & preview together" guarantee).
      {
        find: /^@fusionui\/vue\/styles$/,
        replacement: r('../../packages/vue/src/styles/main.scss'),
      },
      { find: /^@fusionui\/vue$/, replacement: r('../../packages/vue/src/index.ts') },
      { find: '@', replacement: r('./src') },
    ],
  },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    vueJsx(),
    Markdown({
      markdownItSetup(md) {
        // Adds id attributes to headings (for #anchor navigation) without
        // wrapping them in <a> tags, so headings keep their normal color.
        md.use(anchor)
      },
    }),
    Pages({ extensions: ['vue', 'md'], dirs: 'src/pages' }),
  ],
  optimizeDeps: {
    // Don't pre-bundle the workspace library/icons so source edits reflect live.
    exclude: ['@fusionui/vue', '@fusionui/icons', '@fusionui/tokens', '@fusionui/shaders'],
  },
})
