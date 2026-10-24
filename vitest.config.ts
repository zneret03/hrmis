import { defineConfig } from 'vitest/config';

// Root config shared by every workspace project (see vitest.workspace.ts).
// Disabling PostCSS here stops Vite from trying to load the app's Tailwind v4
// `postcss.config.mjs`, which it can't parse and which tests don't need.
export default defineConfig({
  css: { postcss: { plugins: [] } },
});
