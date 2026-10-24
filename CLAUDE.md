# CLAUDE.md

Guidance for working in this repository. This documents the **existing**
conventions — follow them; don't introduce parallel patterns.

## Project

**HRMIS** — a Human Resource Management Information System: attendance, leave
(applications, credits, categories, leave cards), awards, PDS (personal data
sheet), document templates/requests, and user management, with separate
**admin**, **staff**, and **employee** experiences.

**Stack:** Next.js 15 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Supabase (Postgres + Auth, via `@supabase/ssr`) · Tailwind CSS v4 · shadcn/ui
(Radix) · Zustand · react-hook-form · axios · Syncfusion Document Editor.
**Package manager: Yarn (v1).**

## Commands

| Task                         | Command                                             |
| ---------------------------- | --------------------------------------------------- |
| Dev server                   | `yarn dev` (or `make run-dev` to also start the DB) |
| Production build             | `yarn build`                                        |
| Lint (also checks Prettier)  | `yarn lint`                                         |
| Typecheck                    | `yarn typecheck`                                    |
| Format                       | `yarn format`                                       |
| All tests                    | `yarn test`                                         |
| Unit + UI tests only         | `yarn test:unit`                                    |
| API / integration tests only | `yarn test:integration`                             |
| Coverage                     | `yarn test:coverage`                                |
| Watch tests                  | `yarn test:watch`                                   |
| Start / stop local DB        | `yarn start:db` / `yarn stop:db`                    |
| New migration                | `make migrate-new name=<name>`                      |
| Reset + reseed DB            | `make migrate-reset`                                |
| Regenerate DB types          | `make generate-types`                               |

**Before pushing, run the quality gate:** `yarn typecheck && yarn lint && yarn test`
(or the `/check` slash command). This is exactly what CI enforces.

## Architecture

Requests flow through clear layers. Keep each layer's responsibility intact.

```
UI (app/**/page.tsx, **/components/*.tsx)
  → client service (services/<domain>/*.service(s).ts)   // axios → internal API
    → API route (app/api/**/route.ts)                     // thin: parse + delegate
      → API model (app/api/**/model/*.ts)                 // business logic
        → Supabase server client (config/index.ts)        // DB + auth
      → response helper (app/api/helpers/response.ts)      // typed status responses
```

Client-side UI state lives in **Zustand** stores (`services/<domain>/states/`).

### API routes — the standard pattern

- Routes live under `app/api/`. **Authenticated** endpoints go under
  `app/api/protected/`.
- `route.ts` is **thin**: read the body, branch on a `type` discriminator, and
  delegate to a model function. Example (`app/api/auth/route.ts`):

  ```ts
  export async function POST(req: NextRequest) {
    const body = await req.json();
    if (isEmpty(body)) return validationErrorNextResponse();
    if (body.type === 'sign-out') return signOut();
    if (body.type === 'sign-in') return signIn(body);
  }
  ```

- **Business logic lives in `model/*.ts`** (co-located per route, plus shared
  models in `app/api/protected/model/`). Models call `createClient()` and return
  a response helper.
- **Always return a response helper** from `app/api/helpers/response.ts` —
  `successResponse`, `badRequestResponse`, `unauthorizedResponse`,
  `forbiddenResponse`, `notFoundResponse`, `conflictRequestResponse`,
  `validationErrorNextResponse`, `generalErrorResponse`. Don't hand-roll
  `NextResponse` with ad-hoc status codes.
- Success shape is `{ message, data }`; errors are `{ error }` (or `{ message }`).

### Client services — the standard pattern

- One file per domain: `services/<domain>/<name>.services.ts` (a few older
  files use singular `.service.ts` — prefer **`.services.ts`** for new code).
- Use the shared **`axiosService`** (`app/api/axios-client`, baseURL =
  `NEXT_PUBLIC_APP_URL`, forwards cookies on the server) to call
  `/api/protected/...`. (Auth is the one exception: it uses bare `axios` against
  the relative `/api/auth`.)
- Return `response.data.data`. On error, `toast.error(...)` and
  **rethrow `e.response?.data.error`** so the caller can react. Mirror this
  try/catch shape:

  ```ts
  export const getThings = async (params: string) => {
    try {
      const res = await axiosService.get(`/api/protected/things${params}`);
      return res.data.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error('ERROR!', { description: e.response?.data.error });
        throw e.response?.data.error;
      }
    }
  };
  ```

### State — Zustand

- Stores live in `services/<domain>/states/` (occasionally `state/`), created
  with `create()` and `persist` where persistence is needed (see
  `services/auth/states/auth-state.ts`, which persists to `sessionStorage`).
- Read with `useShallow` selectors to avoid needless re-renders.

### Supabase clients

- **Server** (route handlers, server components): `createClient()` from
  `@/config` (`config/index.ts`) — `createServerClient`, uses the **service
  secret** key, wires Next cookies.
- **Browser** (client components): `createClient()` from `@/config/client` —
  `createBrowserClient`, uses the **publishable** key.

### Auth (important)

Login is **by `username`, not email.** The API looks up `public.users` by
`username`, then calls `supabase.auth.signInWithPassword` with that user's
email. The seeded admin is username **`hrmis_admin`** (email
`admin2@example.com`). Role-based redirects after login: `staff` →
`/staff/{id}/users`, `employee` → `/employee/{id}/personal_management`,
otherwise (admin) → `/backend/{id}/dashboard`.

### Middleware

`middleware.ts` composes a **stack** (`middlewares/stackMiddlewares.ts`); order
matters (`authMiddlware` then `protectedRoutesMiddlware`). Add cross-cutting
request logic as a new middleware in the stack, not inline.

### Types

- `lib/types/db-types.ts` is **generated** from the DB (`make generate-types`) —
  don't hand-edit. `database.types.ts` at the root is the Supabase-generated
  mirror.
- Domain types derive from the generated `Database` type, e.g.
  `Database['public']['Tables']['users']['Row']` (see `lib/types/users.ts`).
  Add new domain types under `lib/types/`.

## Design system

- **shadcn/ui**, `new-york` style, base color **slate**, CSS variables, **lucide**
  icons (config in `components.json`). RSC enabled.
- `components/ui/` — shadcn primitives. Treat as generated; some are intentionally
  customized (e.g. `input.tsx` adds `title` / `hasError` / `errorMessage` /
  `isOptional`). Keep edits minimal and consistent with the primitive's API.
- `components/custom/` — app wrappers composed from primitives. **Prefer these in
  app code**, e.g. use `CustomButton` (built-in `isLoading` spinner) over raw
  `Button`; also `Pagination`, `Breadcrumbs`, `DialogAlert`, `EmptyPlaceholder`,
  `Spinner`, `Tooltip`, `Container`.
- Merge classes with **`cn()`** from `@/lib/utils` (clsx + tailwind-merge). Never
  concatenate class strings by hand.
- Design tokens (colors in **oklch**, radius, chart + sidebar colors, dark mode)
  live in `app/globals.css`. Use token classes (`bg-primary`,
  `text-muted-foreground`, `border-input`, …) rather than raw hex/palette values.
- Tailwind v4 (`@import 'tailwindcss'` + `@theme inline`); there is no
  `tailwind.config`. The Prettier Tailwind plugin sorts class names — let it.

## Testing

Test runner is **Vitest** with two projects (see `vitest.workspace.ts`):

- **`unit`** — jsdom env, for pure helpers and React components
  (`@testing-library/react`). Files: `*.test.ts` / `*.test.tsx` under
  `helpers/`, `lib/`, `hooks/`, `components/`, `app/`.
- **`integration`** — node env, for API **route handlers** exercised
  end-to-end with a mocked Supabase client. Files: **`*.int.test.ts`**.

Co-locate tests in a `__tests__/` folder next to the code. Import test globals
explicitly (`import { describe, it, expect, vi } from 'vitest'`); jest-dom
matchers are registered in `vitest.setup.ts`. See `docs/TESTING.md` for the full
guide, including the Supabase-mock pattern used in
`app/api/auth/__tests__/auth.int.test.ts`.

## CI

`.github/workflows/ci.yml` runs on pushes and PRs to `main`, in three jobs:
**Typecheck & Lint**, **Unit & Integration Tests** (+ coverage artifact), and
**Build** (with placeholder env). Keep all three green.

## Database

- Migrations: `supabase/migrations/` (create with `make migrate-new name=...`).
- Seeds: `supabase/seeds/*.sql`, applied on `make migrate-reset`. Auth users are
  seeded in `supabase/seeds/auth.sql` with a **bcrypt** `encrypted_password`
  (generate with pgcrypto or a bcrypt tool; never store plaintext).
- Local dev seed login: username `hrmis_admin` / password `Password123!`.

## Conventions quick reference

- **Yarn** only (there is a `yarn.lock`); don't add `package-lock.json` churn.
- **Imports** use the `@/*` alias (→ repo root). No deep relative chains.
- **Prettier:** single quotes, semicolons, trailing commas (`all`), width 80,
  2-space indent. Enforced via the `prettier/prettier` ESLint rule — a format
  slip fails `yarn lint`.
- **ESLint:** `next/core-web-vitals` + `next/typescript` + `prettier` + jsx-a11y.
  `no-console` except `error` / `info` / `warn`. Variable naming is
  camelCase / snake_case / UPPER_CASE (relaxed inside `components/`).
- **File naming:** components `PascalCase.tsx`; helpers/utilities `camelCase.ts`;
  services `kebab-case.services.ts`; route files `route.ts`; co-located UI under
  `components/`, data-fetching under `model/` or `services/`.
- **Routes** are grouped by audience: `app/backend/[userId]/…` (admin),
  `app/staff/[userId]/…`, `app/employee/[userId]/…`; each page dir typically
  ships `page.tsx` + `loading.tsx` + `error.tsx` + a `components/` folder.
- Don't commit secrets. `.env` is generated by `make setup-supabase`.
