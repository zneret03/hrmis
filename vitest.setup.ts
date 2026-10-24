// Registers jest-dom matchers (e.g. toBeInTheDocument) and their TypeScript
// augmentation for the Vitest `expect`, and unmounts React trees between tests.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
