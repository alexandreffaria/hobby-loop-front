import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // Required for @testing-library/react auto-cleanup between tests,
    // which hooks into the global afterEach.
    globals: true,
  },
})
