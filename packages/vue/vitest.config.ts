import { defineConfig } from 'vitest/config'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vueJsx()],
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // jsdom's CSS parser doesn't understand `@layer` and noisily logs the whole
    // injected theme stylesheet. The styles still apply in real browsers.
    onConsoleLog(log) {
      if (log.includes('Could not parse CSS stylesheet')) return false
      return undefined
    },
  },
})
