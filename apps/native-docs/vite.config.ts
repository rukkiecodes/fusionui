import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Markdown from 'unplugin-vue-markdown/vite'
import Pages from 'vite-plugin-pages'
import anchor from 'markdown-it-anchor'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  // Served under a sub-path on the fusionui-mobile Pages site (set by deploy).
  base: process.env.DOCS_BASE ?? '/',
  // The docs read the real copy-in registry from packages/native (a sibling package).
  server: { fs: { allow: [r('../..')] } },
  resolve: {
    alias: [
      // Resolve the web library to its SOURCE so the docs chrome (navbar,
      // sidebar, buttons) hot-reloads live off packages/vue/src.
      {
        find: /^@rukkiecodes\/vue\/styles$/,
        replacement: r('../../packages/vue/src/styles/main.scss'),
      },
      { find: /^@rukkiecodes\/vue$/, replacement: r('../../packages/vue/src/index.ts') },
      { find: '@', replacement: r('./src') },
    ],
  },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    vueJsx(),
    Markdown({
      markdownItSetup(md) {
        md.use(anchor)
      },
    }),
    Pages({ extensions: ['vue', 'md'], dirs: 'src/pages' }),
  ],
  optimizeDeps: {
    exclude: ['@rukkiecodes/vue', '@rukkiecodes/icons', '@rukkiecodes/tokens'],
  },
})
