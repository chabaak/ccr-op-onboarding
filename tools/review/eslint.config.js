// Flat config for the deterministic review layer.
//
// Scope is deliberately narrow. This repo already enforces a great deal through
// the compiler (`strict`, `noUnusedLocals`, `noUnusedParameters`, and the
// DOM-free `tsconfig.core.json`), so ESLint is here for the two things tsc
// cannot see: unawaited promises, and functions that have outgrown a reader.
//
// Rules are chosen so the tree is CLEAN at adoption except where a finding is
// real and tracked. A gate that starts red teaches everyone to ignore it.
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Config lives in tools/review/ (its own install, so the root devDependency
  // freeze in `A8 — no new dependency` stays intact); lint the repo above it.
  { basePath: '../..' },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '.claude/**',
      '.github/skills/**',
      '**/*.generated.ts',
      '**/*.d.ts',
    ],
  },
  {
    files: ['src/**/*.ts', 'proxy/src/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname + '/../..',
      },
    },
    rules: {
      // The boot invariant in shell/boot.ts:95 promises a judge never sees a
      // blank page. `ignoreVoid:false` is the point: `void f()` is exactly how
      // an unhandled rejection gets silenced at src/client/main.ts.
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
      '@typescript-eslint/no-misused-promises': 'error',

      // Size and branch caps. Set just above the current worst non-god-file so
      // the three known offenders report and nothing else does.
      'max-lines-per-function': ['warn', { max: 120, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', { max: 15 }],
      'max-depth': ['warn', { max: 4 }],

      // Redundant with tsc's own checks in this repo; off to avoid double-reporting.
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
