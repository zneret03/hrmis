# e2e — Playwright end-to-end tests

Browser tests and screenshot capture for HRMIS, using
[`@playwright/test`](https://playwright.dev).

```
e2e/
  helpers/login.ts              reusable admin sign-in (by username)
  smoke.spec.ts                 auth + key admin pages load
  reporting.screenshots.spec.ts captures "before" screenshots for the Reporting spec
  artifacts/                    generated output (gitignored): HTML report, traces, test-results
```

Config: `../playwright.config.ts` (testDir `./e2e`, output `./e2e/artifacts`).

## Prerequisites

1. The app must be running on `http://localhost:3000` (override with
   `NEXT_PUBLIC_APP_URL`). Start it with `make run-dev` (app + DB) or `yarn dev`.
   Playwright will reuse an already-running server and only start one itself if
   nothing is up.
2. The local DB must be seeded (`make migrate-reset`) so the admin
   `hrmis_admin` / `Password123!` exists.
3. Browsers installed once: `npx playwright install chromium`.

## Run

```bash
yarn test:e2e                 # run all e2e specs (headless)
yarn test:e2e:ui              # interactive UI mode
yarn test:e2e e2e/smoke.spec.ts   # a single spec
yarn test:e2e:report          # open the last HTML report
```

## Screenshots

`reporting.screenshots.spec.ts` writes current-state images into
`../.claude/reporting/screenshots/` (`*-current-before.png`). After a feature is
implemented, add the matching `*-after.png` and embed both in
`.claude/reporting-action-items.md`. Naming convention:
`.claude/reporting/screenshots/README.md`.

## Notes

- Login is by **username**, not email (see `helpers/login.ts`).
- The app persists auth in `sessionStorage`, which survives navigations within a
  test's page but not across isolated test contexts — each test logs in.
- E2E is a local/manual suite; it is intentionally not part of CI (it needs a
  running app + seeded DB). The CI pipeline runs typecheck, lint, Vitest, build.
