import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'unplugin-vue-markdown/vite'
import Pages from 'vite-plugin-pages'
import anchor from 'markdown-it-anchor'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      // Resolve the library to its SOURCE so editing packages/vue-dl/src
      // hot-reloads live in the docs (the "build & preview together" guarantee).
      { find: /^vue-dl\/styles$/, replacement: r('../../packages/vue-dl/src/styles/main.scss') },
      { find: /^vue-dl$/, replacement: r('../../packages/vue-dl/src/index.ts') },
      { find: '@', replacement: r('./src') },
    ],
  },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    vueJsx(),
    Markdown({
      markdownItSetup(md) {
        md.use(anchor, { permalink: anchor.permalink.headerLink() })
      },
    }),
    Pages({ extensions: ['vue', 'md'], dirs: 'src/pages' }),
  ],
  optimizeDeps: {
    // Don't pre-bundle the workspace library/icons so source edits reflect live.
    exclude: ['vue-dl', '@vue-dl/icons-feather'],
  },
})
