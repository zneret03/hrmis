import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Resolve the `@/*` path alias (see tsconfig.json) without a trailing slash so
// `@/config` maps to `<root>/config` rather than `<root>//config`.
const root = fileURLToPath(new URL('.', import.meta.url)).replace(/\/+$/, '');
const alias = [{ find: /^@\/(.*)$/, replacement: `${root}/$1` }];

const sharedExclude = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/supabase/**',
  '**/e2e/**',
];

export default defineWorkspace([
  // Unit + UI component tests — run in a browser-like DOM.
  {
    plugins: [react()],
    resolve: { alias },
    // Tests don't need the project's Tailwind v4 PostCSS pipeline.
    css: { postcss: { plugins: [] } },
    test: {
      name: 'unit',
      environment: 'jsdom',
      css: false,
      setupFiles: ['./vitest.setup.ts'],
      include: [
        'helpers/**/*.test.{ts,tsx}',
        'lib/**/*.test.{ts,tsx}',
        'hooks/**/*.test.{ts,tsx}',
        'components/**/*.test.{ts,tsx}',
        'app/**/*.test.{ts,tsx}',
      ],
      exclude: [...sharedExclude, '**/*.int.test.{ts,tsx}'],
    },
  },
  // API / integration tests — run in Node, exercise route handlers end-to-end.
  {
    plugins: [react()],
    resolve: { alias },
    css: { postcss: { plugins: [] } },
    test: {
      name: 'integration',
      environment: 'node',
      css: false,
      include: ['**/*.int.test.{ts,tsx}'],
      exclude: sharedExclude,
    },
  },
]);
