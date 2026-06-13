import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vueJsx()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue'],
      // The WebGL runtime is split into its own chunk automatically by the
      // dynamic import() in FShaderSurface / the v-shader directive.
      output: { exports: 'named' },
    },
    emptyOutDir: true,
    sourcemap: true,
  },
})
