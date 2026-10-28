# Service Record CRUD parity + Loyalty "Permanent since" — Parity & Action Items

Source: two change requests (screenshots, 2026-10-28).

1. **Employee Service Record** should have the **same CRUD operations as the
   Personnel Leave Card**.
2. **Loyalty Award Statistics — Employee List**: _Years of Service_ must count
   from the date the employee became **Permanent**, not from when they started
   (`date_of_original_appointment`). Example from the screenshot: _Gimeno,
   Christian_ shows **36** years (original appointment), but his service record
   says **Permanent from 2010-06-07** → should be **16** (as of 2026-10-28).

**Legend**

- Parity status: ✅ Done · 🟡 Partial · ❌ Missing · 🐞 Bug
- Priority: **P0** (requested, blocking) · **P1** (needed for parity) · **P2** (polish/gap)

---

## 1. Parity matrix (at a glance)

### Feature 1 — Service Record vs. Personnel Leave Card (admin)

| #   | Capability                                                                     | Personnel Leave Card (reference)                          | Service Record today                                    | Status | Priority |
| --- | ------------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------- | ------ | -------- |
| 1a  | Entry point = searchable **employee picker** (cards: name, email, ID badge)    | `leave-card/page.tsx` + `EmployeeLeaveCardList`           | One flat, paginated table of **all** employees' entries | ❌     | P0       |
| 1b  | **Per-employee page** `…/[employeeId]` with header (name, email, ID) + Back    | `leave-card/[employeeId]/page.tsx`                        | None                                                    | ❌     | P0       |
| 1c  | **Add** = inline editable row at the top of the table; ✓ Save (when dirty) / ✕ | `LeaveCardTable` draft row                                | Modal with an employee dropdown                         | ❌     | P0       |
| 1d  | **Edit** = row ⋯ → "Edit Entry" → pre-filled dialog scoped to that employee    | `LeaveCardEntryDialog`                                    | Dialog exists (works), not employee-scoped              | 🟡     | P0       |
| 1e  | **Delete** = row ⋯ → "Delete Entry" (destructive) → confirm → soft delete      | `DeleteLeaveCardEntryDialog`                              | Works; wording/styling differ                           | 🟡     | P1       |
| 1f  | Skeleton loading for list + detail pages                                       | `loading.tsx` (grid / table skeletons)                    | Spinner on the list only                                | 🟡     | P2       |
| 1g  | Back button returns to the employee list                                       | 🐞 `PreviousButton` pushes `/users/{id}/businesses` (404) | n/a                                                     | 🐞     | P1       |
| 1h  | Entry validation                                                               | Year ≤ current year                                       | None (From may be after To)                             | ❌     | P1       |
| 1i  | Status picked from the managed **Employee Status** list                        | n/a                                                       | Free text (typos like "permanent " break Feature 2)     | ❌     | P0       |
| 1j  | Admin-only writes enforced server-side                                         | 🐞 none (see §4)                                          | ✅ 403 for non-admins                                   | ✅     | —        |
| 1k  | Employee read-only view of own records                                         | n/a                                                       | ✅ `/employee/[userId]/service-record`                  | ✅     | —        |

### Feature 2 — Loyalty Years of Service

| #   | Requirement                                                                 | Today                                                                                         | Status | Priority |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------ | -------- |
| 2a  | Years of Service start = date the employee became **Permanent**             | `age(CURRENT_DATE, users.date_of_original_appointment)` (SQL) / `differenceInYears(...)` (TS) | ❌     | P0       |
| 2b  | Only **Permanent** employees are counted                                    | Everyone with an original-appointment date is counted (Elected, Casual, Contractual included) | ❌     | P0       |
| 2c  | Chart statistic and View/Export list use the **same** rule                  | Same input, but computed twice (SQL RPC + TS route) → can drift                               | 🟡     | P0       |
| 2d  | Service-record **Status** values are consistent enough to match "Permanent" | Free text (see 1i)                                                                            | ❌     | P0       |

---

## 2. Feature 1 — Employee Service Record: Leave-Card CRUD parity

### Current state

- `app/backend/[userId]/service-record/page.tsx` lists **every** employee's
  entries in one paginated table; "Add Service Record" opens a modal where the
  admin must pick the employee from a dropdown (`ServiceRecordFormDialog`).
- API (`app/api/protected/service_record`) already supports `?userId=` scoping,
  admin-only writes, and soft delete — no API shape change needed.

### Action items

- [x] **AI-1.1 (P0)** Extract the leave-card employee picker into a shared
      `app/components/EmployeePickerList.tsx` (search by name/email/ID → card
      grid → `router.push(\`${pathname}/${id}\`)`). Leave card and service record
      both use it (no behavior change for leave card).
- [x] **AI-1.2 (P0)** `service-record/page.tsx` → employee picker (role
      `employee`, not archived) via `fetchAllUsers` (add `first_name`,
      `last_name` to `/api/protected/users/all`). Skeleton `loading.tsx`.
- [x] **AI-1.3 (P0)** New `service-record/[employeeId]/page.tsx` (+
      `loading.tsx`): Back button, employee header (name, email, ID badge),
      that employee's entries (all, no pagination — like the leave card), add/
      edit/delete dialogs.
- [x] **AI-1.4 (P0)** `ServiceRecordTable`: **inline add row** (Position\*,
      Status, Salary, Station, From, To, Remarks) with ✕ Cancel / ✓ Save shown
      once the row is dirty — mirrors `LeaveCardTable`.
- [x] **AI-1.5 (P0)** ~~`ServiceRecordFormDialog` → employee-scoped
      (`targetUserId` prop, no employee dropdown); menu labels "Edit Entry" /
      "Delete Entry" (destructive); delete copy aligned with the leave card.~~
      _Superseded by §6: edit and delete now happen in the table; the dialogs
      were removed._
- [x] **AI-1.6 (P0)** Status = `Select` fed by `getAllEmployeeStatus()` in both
      the inline row and the dialog (keeps a legacy value that is not in the
      list so old rows still edit cleanly).
- [x] **AI-1.7 (P1)** Validation: From must not be after To — client (row +
      dialog) **and** server (`model/service_record.ts` → `badRequestResponse`).
- [x] **AI-1.8 (P1)** Fix `components/custom/PreviousButton.tsx` to go to the
      parent route (fixes the leave card's broken Back too).
- [x] **AI-1.9 (P1)** Tests: integration tests for From > To rejection (add +
      edit), admin `?userId` scoping, edit dates, non-admin PUT 403; unit tests
      for the shared picker, `employeeName`, and `helpers/serviceRecord`;
      Playwright `e2e/service-record.spec.ts` (full CRUD flow + Back).

### Acceptance criteria

- [x] Service Record opens on an employee picker identical in look/behavior to
      the Personnel Leave Card picker; selecting an employee opens their page.
- [x] On the employee page the admin can **add** an entry inline (Save appears
      only after typing), **edit** any field incl. dates, and **delete** with a
      confirmation — all directly in the table (see §6).
- [x] Status is chosen from the managed Employee Status list.
- [x] Saving an entry whose From is after To is rejected (client + API 400).
- [x] Back returns to the employee picker (service record **and** leave card).
- [x] Employee read-only view and admin-only API enforcement are unchanged.

### Testing & verification

- `yarn typecheck && yarn lint && yarn test` green.
- Integration: existing `service_record.int.test.ts` + new From > To case.
- Unit: `EmployeePickerList` filters by name / email / employee ID.
- Manual (local): picker → employee → add inline → edit dates → delete.

---

## 3. Feature 2 — Loyalty: count Years of Service from the Permanent date

### Rule (implemented default — see open questions §5)

```
permanent_since = earliest From date of the employee's active service-record
                  entries whose Status is "Permanent" (case/space-insensitive)
                  — fallback: date_of_original_appointment, only when the
                    employee has no Permanent entry yet AND
                    users.employment_status is "Permanent"
years_of_service = whole years from permanent_since to today
Employees with no permanent_since (Elected, Casual, Contractual, …) are not
counted in Loyalty Award Statistics, its View list, or its CSV export.
```

Worked examples (as of 2026-10-28):

| Employee      | Original appt. | Service record                          | Before | After             |
| ------------- | -------------- | --------------------------------------- | ------ | ----------------- |
| Gimeno, C.    | ~1990          | Permanent from 2010-06-07               | 36     | **16**            |
| Rosum, Jan    | 2016-05-01     | Permanent from 2016-05-01 (+2021 promo) | 10     | **10**            |
| Santos, Maria | 2006-06-01     | Elected only                            | 20     | **not counted**   |
| Cruz, Pedro   | 2011-03-01     | none, status Permanent                  | 15     | **15** (fallback) |
| Cruz (reseed) | 2011-03-01     | Casual 2011 → Permanent from 2016-03-01 | 15     | **10**            |

### Action items

- [x] **AI-2.1 (P0)** Migration: `get_employee_years_of_service()` — one row per
      counted employee (`user_id`, `permanent_since`, `years_of_service`). The
      **single source of truth**. `SECURITY INVOKER`, so `service_record` RLS
      still applies to direct `/rpc` calls (the server uses the service role).
      _Changed during implementation:_ EXECUTE is **not** revoked — on the
      local `supabase/postgres:17.6.1.106` image any permission-denied
      function call segfaults the backend (see §4).
- [x] **AI-2.2 (P0)** Re-create `get_loyalty_award_statistics()` on top of it
      (exact-milestone logic from the threshold table unchanged).
- [x] **AI-2.3 (P0)** `users/by-category` route: `loyalty` values come from the
      RPC (same rule as the chart), non-permanent employees excluded.
- [x] **AI-2.4 (P1)** Tests: by-category loyalty uses the RPC years and excludes
      employees without a Permanent start; RPC error → 400.
- [x] **AI-2.5 (P1)** Seed: give Pedro Cruz a Casual → Permanent history so the
      rule is visible in sample data.
- [x] **AI-2.6 (P1)** Verify against the local DB (rolled-back transaction with a
      Gimeno-like case).

### Acceptance criteria

- [x] An employee who started Casual in 1990 and became Permanent on
      2010-06-07 shows **16** years (as of 2026-10-28), in both the chart
      bracket and the View/Export list.
- [x] Elected / Casual / Contractual employees without a Permanent entry are
      not counted.
- [x] Chart counts equal the number of View rows per bracket.

### Verification (2026-10-28)

- `yarn typecheck && yarn lint && yarn test` → green, **98/98** tests.
- Migration dry-run in a rolled-back transaction on the local DB: Permanent
  from 2010-06-07 → **16**; Casual 2011 → `' permanent '` 2015 → **11**
  (status matched case/space-insensitively); Permanent starting 2027 → not
  counted; Elected → not counted. Then applied with `make migrate-up`.
- `e2e/service-record.spec.ts` (3/3 against the dev server): picker → inline
  add (From > To blocked) → edit dates → delete → Back; leave card Back;
  loyalty View list shows only Permanent employees and its row count matches
  the chart total.

---

## 4. Cross-cutting gaps found (not in scope — flagged)

- **Leave card API has no role check** — `app/api/protected/leave_card` POST/
  PUT/DELETE accept any authenticated user (service key bypasses RLS). Service
  record already guards with `requireAdmin`; leave card should too.
- Protected-route matching in `config/updateSession.ts` uses
  `pathname.endsWith(route)`, so nested pages (`…/leave-card/{id}`,
  `…/service-record/{id}`) aren't in the unauthenticated redirect list; they
  still rely on the role checks and API guards.
- **`users` is readable by anyone** — RLS policy `users_fetched_info`
  (`FOR SELECT TO public USING (true)`) lets the anon key read every user row
  (emails, birthdates, government IDs, …).
- **Local DB crash on function permission errors** — on
  `supabase/postgres:17.6.1.106` (the local image), calling any function the
  role lacks EXECUTE on kills the backend with signal 11 (Postgres auto-
  recovers). Table permission errors are fine. Likely the supautils
  privilege-hint hook; check before relying on `REVOKE EXECUTE` anywhere, and
  consider upgrading the Supabase CLI/image.

## 5. Open questions (defaults implemented — confirm)

1. **No Permanent service-record entry yet** but the profile status is
   Permanent → we fall back to the original appointment date. Alternative:
   don't count them until HR encodes the service record.
2. **End of counting** → today. Alternative: stop at the last Permanent entry's
   To date (Gimeno's Permanent entry ends 2026-04-08 → 15 instead of 16).
3. **Breaks in permanent service** (Permanent → resigned → re-hired) → counted
   from the **earliest** Permanent date. Alternative: sum only Permanent
   periods.
4. **Non-permanent employees** → excluded from the loyalty statistic entirely.
   Alternative: list them as "Not eligible this year".

---

## 6. Change request 2 — add / edit / delete directly in the table (no dialogs)

Request (2026-10-28, with a screenshot of the "Add Service Record Entry"
dialog): _"for Employee Service Record we should directly add edit delete on
the table instead of having Dialog Box, same on Personnel page with table as
being editable"_.

> The screenshot's dialog was a **stale persisted state**: the dialog stores
> were persisted to `sessionStorage`, so an "add" dialog opened on the old
> Service Record page re-opened on the new one. Removing the dialogs (and their
> stores) removes that bug class.

### Parity matrix

| #   | Capability                                                    | Service Record (before) | Personnel Leave Card (before) | Status |
| --- | ------------------------------------------------------------- | ----------------------- | ----------------------------- | ------ |
| 6a  | **Add** in the table (inline row, ✓ when dirty / ✕)           | ✅                      | ✅                            | ✅     |
| 6b  | **Edit** in the table (row → inputs, ✓ / ✕, Enter saves, Esc) | Dialog                  | Dialog                        | ✅     |
| 6c  | **Delete** in the table ("Delete?" ✓ / ✕ in the row)          | Confirm dialog          | Confirm dialog                | ✅     |
| 6d  | No dialog state persisted across pages                        | 🐞 stale dialog         | Same risk                     | ✅     |
| 6e  | Wide table scrolls inside its box (page doesn't widen)        | n/a                     | 🐞 ✓ / bell cut off at 1280px | ✅     |

### Action items

- [x] **AI-6.1 (P0)** Shared `hooks/use-inline-row-editor.ts`
      (`useInlineRowEditor`): one row at a time is being added, edited, or
      confirmed for deletion; holds the row's draft + dirty flag.
- [x] **AI-6.2 (P0)** Shared `components/custom/InlineRowActions.tsx`:
      ✎ / 🗑 (view) · ✕ / ✓ (editing) · "Delete?" ✓ / ✕ (confirm). Other
      rows' actions and "Add Entry" are disabled while a row is busy.
- [x] **AI-6.3 (P0)** `ServiceRecordTable`: edit + delete in the row (Status
      select keeps a legacy value; From ≤ To and Position required). Removed
      `ServiceRecordFormDialog`, `DeleteDialog`, and the
      `service-record-dialog` store.
- [x] **AI-6.4 (P0)** `LeaveCardTable`: edit + delete in the row (Year 1900…
      current year, as the old dialog enforced; Month select keeps a legacy
      value). Edits no longer reset `leave_application_id` to null (the old
      dialog did). Removed `LeaveCardEntryDialog`,
      `DeleteLeaveCardEntryDialog`, and the `leave-card-dialog` store.
- [x] **AI-6.5 (P1)** `app/backend/layout.tsx`: `SidebarInset` gets
      `min-w-0` so wide tables scroll inside their own container instead of
      widening the page (no other admin page overflowed before or after).
- [x] **AI-6.6 (P1)** Tests: hook (5), `InlineRowActions` (5),
      `withCurrentOption`, `leaveCard` year rule; e2e covers both tables
      end-to-end (Escape cancels, no dialog ever opens).

### Acceptance criteria

- [x] Service Record and Personnel Leave Card: add, edit, and delete happen in
      the table rows; no dialog box opens for any of them.
- [x] Invalid rows can't be saved (Service Record: Position, From ≤ To; Leave
      Card: Year range) and show the reason under the row.
- [x] Enter saves the row being edited; Escape cancels editing or a pending
      delete.

### Verification (2026-10-28)

- `yarn typecheck && yarn lint && yarn test` → green, **112/112**.
- `e2e/service-record.spec.ts` → **3/3** against the dev server (Service
  Record add/edit/delete in the table + Back; Leave Card add/edit/Escape/
  delete + Back; loyalty list).
- Layout: with `min-w-0` the Leave Card page is exactly viewport-wide at
  1280px while a row is being edited (was 1320px). Note: the running Turbopack
  dev server kept serving the old layout to routes compiled before the edit;
  restart `yarn dev` to pick it up everywhere.
