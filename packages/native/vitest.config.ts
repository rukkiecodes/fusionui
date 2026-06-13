import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    // Only the pure layers (engine math, token data, source-parity) are unit-
    // tested here; component rendering needs a RN runtime (jest-expo / EAS).
    include: ['src/**/*.{test,spec}.ts'],
  },
})
