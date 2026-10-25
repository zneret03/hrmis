# Reporting — Screenshots & visual evidence

Before/after screenshots that prove each action item in
`../../reporting-action-items.md` meets its acceptance criteria.

> **Capture is automated.** The current-state `*-current-before.png` images here
> were captured with Playwright (`yarn test:e2e e2e/reporting.screenshots.spec.ts`)
> against the running app. Add the matching `*-after.png` as each feature ships,
> and extend `e2e/reporting.screenshots.spec.ts` to cover the new pages.

## Naming convention

`<feature#>-<slug>[-before|-after].png`

| Feature                          | Expected files                                                                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Master List & Status         | `01-master-list-all.png`, `01-master-list-permanent.png`, `01-export-csv.png`, `01-employee-status-manage.png`, `01-registration-status-dropdown-before.png`, `01-registration-status-dropdown-after.png` |
| 2 — Charts View/Export + Loyalty | `02-charts-view-gender.png`, `02-charts-export-gender.png`, `02-charts-view-age.png`, `02-loyalty-before.png`, `02-loyalty-after.png`                                                                     |
| 3 — Service Record               | `03-admin-service-record.png`, `03-admin-edit-date.png`, `03-employee-view-readonly.png`                                                                                                                  |
| 4 — Attendance report            | `04-attendance-weekly.png`, `04-attendance-monthly.png`, `04-attendance-yearly.png`, `04-attendance-export-csv.png`, `04-late-undertime-flags.png`                                                        |

## How to embed in the action-items doc

```markdown
![Master List — All employees](reporting/screenshots/01-master-list-all.png)
```

## Capturing (once a browser tool is available)

1. Run the app: `yarn dev` (DB up via `make run-dev`).
2. Log in as admin (`hrmis_admin` / `Password123!`).
3. Navigate to the page, capture at ~1440px wide, light theme.
4. Save here with the name above; link it next to the matching AC.
