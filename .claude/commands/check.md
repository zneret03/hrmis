---
description: Run the full local quality gate (typecheck, lint, tests)
---

Run the project's quality gate and report results concisely. Stop at the first
failing step and show the relevant output.

1. `yarn typecheck` — TypeScript, no emit
2. `yarn lint` — ESLint (also enforces Prettier)
3. `yarn test` — Vitest unit + integration

If all pass, confirm the branch is green and ready to push.
