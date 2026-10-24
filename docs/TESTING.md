# Testing guide

Test runner: **[Vitest](https://vitest.dev)**. Two projects are defined in
`vitest.workspace.ts`:

| Project       | Env   | Purpose                         | File glob                  |
| ------------- | ----- | ------------------------------- | -------------------------- |
| `unit`        | jsdom | Pure helpers + React components | `*.test.ts` / `*.test.tsx` |
| `integration` | node  | API route handlers, end-to-end  | `*.int.test.ts`            |

Shared config (`vitest.config.ts`) disables the app's Tailwind v4 PostCSS
pipeline, which tests don't need. Matchers and cleanup are registered in
`vitest.setup.ts` (`@testing-library/jest-dom/vitest` + RTL `cleanup`).

## Running

```bash
yarn test              # everything, once
yarn test:unit         # jsdom project only
yarn test:integration  # node / API project only
yarn test:watch        # watch mode
yarn test:coverage     # v8 coverage report (./coverage)
```

## Where tests live

Co-locate in a `__tests__/` folder next to the code under test:

```
helpers/__tests__/avatarName.test.ts
components/custom/__tests__/CustomButton.test.tsx
app/api/auth/__tests__/auth.int.test.ts
```

Always import globals explicitly (keeps `tsc` happy — there are no ambient test
globals):

```ts
import { describe, it, expect, vi } from 'vitest';
```

## Unit test (pure function)

```ts
import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetterWord } from '@/helpers/capitalizeFirstLetterWord';

describe('capitalizeFirstLetterWord', () => {
  it('capitalizes the first letter', () => {
    expect(capitalizeFirstLetterWord('hello')).toBe('Hello');
  });
});
```

## Component test (React Testing Library)

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomButton } from '@/components/custom/CustomButton';

it('renders its children', () => {
  render(<CustomButton>Save</CustomButton>);
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});
```

Prefer role/label queries (`getByRole`, `getByLabelText`) over test IDs.

## API integration test (mocked Supabase)

Name the file `*.int.test.ts` so it runs in the `integration` (node) project.
Import the route handler directly, pass a minimal `NextRequest`, and mock
`@/config` so no real database is touched. Full working example:
`app/api/auth/__tests__/auth.int.test.ts`.

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/route';
import { createClient } from '@/config';

vi.mock('@/config', () => ({ createClient: vi.fn() }));
const mockedCreateClient = vi.mocked(createClient);

// Chainable PostgREST builder whose terminal .single() resolves to `result`.
function builder(result: unknown) {
  const b: Record<string, unknown> = {};
  for (const m of ['select', 'is', 'or', 'eq', 'limit']) b[m] = vi.fn(() => b);
  b.single = vi.fn().mockResolvedValue(result);
  return b;
}

const makeRequest = (body: unknown) =>
  ({ json: async () => body }) as unknown as NextRequest;

beforeEach(() => vi.clearAllMocks());

it('returns 400 for an empty body', async () => {
  const res = await POST(makeRequest({}));
  expect(res?.status).toBe(400);
});
```

`from()` returns a fresh builder per call, so when a model calls `.from()` more
than once, queue results with
`vi.fn().mockReturnValueOnce(builder(...)).mockReturnValueOnce(builder(...))`.

## What to test next (good coverage targets)

- Remaining `helpers/*` pure functions (fast, high value).
- Each `app/api/**/route.ts` handler: happy path + each error branch (400/401/
  403/404/409/500) using the Supabase-mock pattern above.
- `components/custom/*` wrappers and form components (validation, disabled/
  loading states, error rendering).
- Zustand stores in `services/**/states` (set/reset behavior).

## Notes & gotchas

- Tests must pass `tsc --noEmit` too — they're part of `yarn typecheck`.
- `cleanup()` runs automatically after each test (see `vitest.setup.ts`).
- These API tests mock Supabase (fast, hermetic). For true DB-backed E2E later,
  run against a local `supabase start` instance in a separate suite/job.
