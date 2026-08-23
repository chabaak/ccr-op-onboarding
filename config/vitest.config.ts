import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Structural / pure-logic suites only — no DOM (that lives in e2e/ under
// Playwright). The explicit `include`/`exclude` pair keeps the repo-root run
// off the self-contained demo suites under `demos/**`, which carry their own
// vitest projects and would otherwise gate every unit slice here.
export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**', 'demos/**', 'e2e/**'],
  },
})
