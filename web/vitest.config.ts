import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [['junit', { outputFile: 'test-output/junit.xml' }]],
  },
})
