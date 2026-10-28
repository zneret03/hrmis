'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineRowActions } from '@/components/custom/InlineRowActions';
import { cn } from '@/lib/utils';
import { useInlineRowEditor } from '@/hooks/use-inline-row-editor';
import { LeaveCardEntry } from '@/lib/types/leave_card_entries';
import {
  addLeaveCardEntry,
  deleteLeaveCardEntry,
  updateLeaveCardEntry,
} from '@/services/leave_card/leave-card.services';
import { useAuth } from '@/services/auth/states/auth-state';
import { isValidLeaveCardYear, leaveCardYearError } from '@/helpers/leaveCard';
import { withCurrentOption } from '@/helpers/withCurrentOption';

interface LeaveCardTableProps {
  data: LeaveCardEntry[];
  userId: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentYear = new Date().getFullYear();

// Numeric ledger columns, in table order.
const NUMBER_FIELDS = [
  'earned_vacation',
  'earned_sick',
  'enjoyed_vacation',
  'enjoyed_sick',
  'tardy_count',
  'undertime_hours',
  'undertime_minutes',
  'undertime_days_equiv',
  'total_spent_vacation',
  'total_spent_sick',
  'lwop_vacation',
  'lwop_sick',
  'balance_vacation',
  'balance_sick',
  'maternity_leave',
] as const;

type NumberField = (typeof NUMBER_FIELDS)[number];

// Accessible names for the inline inputs (the headers are two-level).
const NUMBER_FIELD_LABELS: Record<NumberField, string> = {
  earned_vacation: 'Leave earned, vacation',
  earned_sick: 'Leave earned, sick',
  enjoyed_vacation: 'Leave enjoyed, vacation',
  enjoyed_sick: 'Leave enjoyed, sick',
  tardy_count: 'Tardy count',
  undertime_hours: 'Undertime hours',
  undertime_minutes: 'Undertime minutes',
  undertime_days_equiv: 'Undertime in days',
  total_spent_vacation: 'Total leave spent, vacation',
  total_spent_sick: 'Total leave spent, sick',
  lwop_vacation: 'Leave without pay, vacation',
  lwop_sick: 'Leave without pay, sick',
  balance_vacation: 'Balance, vacation',
  balance_sick: 'Balance, sick',
  maternity_leave: 'Maternity leave',
};

type DraftRow = { year: string; month: string; remarks: string } & Record<
  NumberField,
  string
>;

function mapNumberFields<T>(
  fn: (field: NumberField) => T,
): Record<NumberField, T> {
  return Object.fromEntries(
    NUMBER_FIELDS.map((field) => [field, fn(field)]),
  ) as Record<NumberField, T>;
}

const emptyDraft = (): DraftRow => ({
  year: String(currentYear),
  month: 'January',
  remarks: '',
  ...mapNumberFields(() => '0'),
});

const toDraft = (entry: LeaveCardEntry): DraftRow => ({
  year: String(entry.year),
  month: entry.month,
  remarks: entry.remarks ?? '',
  ...mapNumberFields((field) => String(entry[field] ?? 0)),
});

const toPayload = (draft: DraftRow) => ({
  year: Number(draft.year),
  month: draft.month,
  remarks: draft.remarks || null,
  ...mapNumberFields((field) => Number(draft[field]) || 0),
  tardy_count: Math.trunc(Number(draft.tardy_count)) || 0,
});

const COLUMN_COUNT = 19;

const th = 'border px-2 py-1 font-semibold text-center align-middle';
const thSub = 'border px-2 py-1 font-medium text-center text-muted-foreground';
const td = 'border px-2 py-1 text-center';
const cellInput =
  'w-full min-w-[44px] bg-transparent px-1 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary rounded-sm border border-transparent focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

export function LeaveCardTable({ data, userId }: LeaveCardTableProps) {
  const router = useRouter();
  const { id: encodedBy } = useAuth();
  const [isPending, startTransition] = useTransition();
  const editor = useInlineRowEditor(emptyDraft);
  const { mode, draft, isDirty } = editor;

  const isYearInvalid = !isValidLeaveCardYear(draft.year);
  const canSave = !isYearInvalid;

  // Runs a save/delete, then leaves edit mode and reloads the server data.
  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      try {
        await action();
      } catch {
        // The service already toasted the error; keep the row to fix it.
        return;
      }
      editor.reset();
      router.refresh();
    });
  };

  const handleSave = () => {
    if (!canSave || (mode.kind !== 'add' && mode.kind !== 'edit')) return;

    const fields = { ...toPayload(draft), encoded_by: encodedBy ?? null };

    run(() =>
      mode.kind === 'edit'
        ? updateLeaveCardEntry(mode.id, fields)
        : addLeaveCardEntry({
            ...fields,
            user_id: userId,
            leave_application_id: null,
          }),
    );
  };

  const handleDraftKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') editor.reset();
    if (e.key === 'Enter' && isDirty) handleSave();
  };

  // Editable cells shared by the add row and the row being edited.
  const draftRow = (key: string, monthOptions: string[]) => (
    <React.Fragment key={key}>
      <tr className="bg-primary/5 border-b" onKeyDown={handleDraftKeyDown}>
        {/* Year */}
        <td className="min-w-[64px] border px-1 py-1">
          <input
            type="number"
            min={1900}
            max={currentYear}
            value={draft.year}
            onChange={(e) => editor.setField('year', e.target.value)}
            aria-label="Year"
            aria-invalid={isYearInvalid}
            className={cn(cellInput, isYearInvalid && 'border-destructive')}
            autoFocus
          />
        </td>
        {/* Month */}
        <td className="min-w-[90px] border px-1 py-1">
          <select
            value={draft.month}
            onChange={(e) => editor.setField('month', e.target.value)}
            aria-label="Month"
            className="focus:ring-primary focus:border-primary w-full rounded-sm border border-transparent bg-transparent px-1 py-0.5 text-xs focus:ring-1 focus:outline-none"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </td>
        {NUMBER_FIELDS.map((field) => (
          <td key={field} className="border px-1 py-1">
            <input
              type="number"
              min={0}
              step={field === 'tardy_count' ? '1' : 'any'}
              value={draft[field]}
              onChange={(e) => editor.setField(field, e.target.value)}
              aria-label={NUMBER_FIELD_LABELS[field]}
              className={cellInput}
            />
          </td>
        ))}
        {/* Remarks */}
        <td className="min-w-[100px] border px-1 py-1">
          <input
            type="text"
            value={draft.remarks}
            onChange={(e) => editor.setField('remarks', e.target.value)}
            placeholder="Optional..."
            aria-label="Remarks"
            className={cellInput}
          />
        </td>
        {/* Actions */}
        <td className="border px-1 py-1">
          <InlineRowActions
            state="editing"
            isPending={isPending}
            isDirty={isDirty}
            canSave={canSave}
            onSave={handleSave}
            onCancel={editor.reset}
          />
        </td>
      </tr>

      {isYearInvalid && (
        <tr>
          <td
            colSpan={COLUMN_COUNT}
            className="text-destructive border px-2 py-1 text-xs"
          >
            {leaveCardYearError()}
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={editor.startAdd} disabled={!editor.isIdle}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse text-xs">
          <thead className="bg-muted/50">
            <tr>
              <th rowSpan={2} className={`${th} px-3 whitespace-nowrap`}>
                Year
              </th>
              <th rowSpan={2} className={`${th} px-3 whitespace-nowrap`}>
                Month
              </th>
              <th colSpan={2} className={th}>
                No. of Days Leave Earned
              </th>
              <th colSpan={2} className={th}>
                Leave Enjoyed
              </th>
              <th rowSpan={2} className={`${th} leading-tight`}>
                No. Tardy for
                <br />5 mins. or more
              </th>
              <th colSpan={3} className={th}>
                Undertime
              </th>
              <th colSpan={2} className={th}>
                Total Leave Spent
              </th>
              <th colSpan={2} className={th}>
                Leave Without Pay
              </th>
              <th colSpan={2} className={th}>
                Balance
              </th>
              <th rowSpan={2} className={`${th} leading-tight`}>
                Maternity
                <br />
                Leave
              </th>
              <th rowSpan={2} className={th}>
                Remarks
              </th>
              <th rowSpan={2} className={th}>
                Actions
              </th>
            </tr>
            <tr className="bg-muted/50">
              <th className={thSub}>Vacation</th>
              <th className={thSub}>Sick</th>
              <th className={thSub}>Vacation</th>
              <th className={thSub}>Sick</th>
              <th className={thSub}>Hours</th>
              <th className={thSub}>Minutes</th>
              <th className={`${thSub} leading-tight`}>
                Equiv.
                <br />
                in Days
              </th>
              <th className={thSub}>Vacation</th>
              <th className={thSub}>Sick</th>
              <th className={thSub}>Vacation</th>
              <th className={thSub}>Sick</th>
              <th className={thSub}>Vacation</th>
              <th className={thSub}>Sick</th>
            </tr>
          </thead>
          <tbody>
            {mode.kind === 'add' && draftRow('new', MONTHS)}

            {data.map((entry) => {
              if (editor.isEditing(entry.id)) {
                return draftRow(
                  entry.id,
                  withCurrentOption(MONTHS, entry.month),
                );
              }

              const isDeleting = editor.isDeleting(entry.id);

              return (
                <tr
                  key={entry.id}
                  className={cn(
                    'hover:bg-muted/30 border-b transition-colors',
                    isDeleting && 'bg-destructive/5',
                  )}
                  onKeyDown={(e) => e.key === 'Escape' && editor.reset()}
                >
                  <td className="border px-3 py-1 font-medium">{entry.year}</td>
                  <td className="border px-3 py-1 whitespace-nowrap">
                    {entry.month}
                  </td>
                  {NUMBER_FIELDS.map((field) => (
                    <td
                      key={field}
                      className={cn(
                        td,
                        field.startsWith('balance_') && 'font-semibold',
                      )}
                    >
                      {entry[field] ?? 0}
                    </td>
                  ))}
                  <td className="text-muted-foreground max-w-[140px] truncate border px-2 py-1">
                    {entry.remarks || '—'}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <InlineRowActions
                      state={isDeleting ? 'confirm-delete' : 'view'}
                      isPending={isPending}
                      disabled={!editor.isIdle}
                      onEdit={() => editor.startEdit(entry.id, toDraft(entry))}
                      onDelete={() => editor.startDelete(entry.id)}
                      onConfirmDelete={() =>
                        run(() => deleteLeaveCardEntry(entry.id))
                      }
                      onCancel={editor.reset}
                    />
                  </td>
                </tr>
              );
            })}

            {!data.length && mode.kind !== 'add' && (
              <tr>
                <td
                  colSpan={COLUMN_COUNT}
                  className="text-muted-foreground h-24 text-center"
                >
                  No entries yet. Click &quot;Add Entry&quot; to encode data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
