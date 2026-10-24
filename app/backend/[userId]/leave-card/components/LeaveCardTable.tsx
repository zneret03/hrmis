'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Pencil, Trash, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLeaveCardDialog } from '@/services/leave_card/states/leave-card-dialog';
import { useShallow } from 'zustand/shallow';
import { LeaveCardEntry } from '@/lib/types/leave_card_entries';
import { addLeaveCardEntry } from '@/services/leave_card/leave-card.services';
import { useAuth } from '@/services/auth/states/auth-state';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

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

type DraftRow = {
  year: string;
  month: string;
  earned_vacation: string;
  earned_sick: string;
  enjoyed_vacation: string;
  enjoyed_sick: string;
  tardy_count: string;
  undertime_hours: string;
  undertime_minutes: string;
  undertime_days_equiv: string;
  total_spent_vacation: string;
  total_spent_sick: string;
  lwop_vacation: string;
  lwop_sick: string;
  balance_vacation: string;
  balance_sick: string;
  maternity_leave: string;
  remarks: string;
};

const emptyDraft = (): DraftRow => ({
  year: String(currentYear),
  month: 'January',
  earned_vacation: '0',
  earned_sick: '0',
  enjoyed_vacation: '0',
  enjoyed_sick: '0',
  tardy_count: '0',
  undertime_hours: '0',
  undertime_minutes: '0',
  undertime_days_equiv: '0',
  total_spent_vacation: '0',
  total_spent_sick: '0',
  lwop_vacation: '0',
  lwop_sick: '0',
  balance_vacation: '0',
  balance_sick: '0',
  maternity_leave: '0',
  remarks: '',
});

const th = 'border px-2 py-1 font-semibold text-center align-middle';
const thSub = 'border px-2 py-1 font-medium text-center text-muted-foreground';
const td = 'border px-2 py-1 text-center';
const cellInput =
  'w-full min-w-[44px] bg-transparent px-1 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary rounded-sm border border-transparent focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

export function LeaveCardTable({ data, userId }: LeaveCardTableProps) {
  const router = useRouter();
  const { id: encodedBy } = useAuth();
  const [isPending, startTransition] = useTransition();

  const { toggleOpen } = useLeaveCardDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  const [isAddingRow, setIsAddingRow] = React.useState(false);
  const [draft, setDraft] = React.useState<DraftRow>(emptyDraft);
  const [isDirty, setIsDirty] = React.useState(false);

  const handleAddEntry = () => {
    setDraft(emptyDraft());
    setIsDirty(false);
    setIsAddingRow(true);
  };

  const handleCancel = () => {
    setIsAddingRow(false);
    setDraft(emptyDraft());
    setIsDirty(false);
  };

  const handleChange = (field: keyof DraftRow, value: string) => {
    if (!isDirty) setIsDirty(true);
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await addLeaveCardEntry({
        user_id: userId,
        encoded_by: encodedBy ?? null,
        leave_application_id: null,
        year: Number(draft.year) || currentYear,
        month: draft.month,
        earned_vacation: Number(draft.earned_vacation) || 0,
        earned_sick: Number(draft.earned_sick) || 0,
        enjoyed_vacation: Number(draft.enjoyed_vacation) || 0,
        enjoyed_sick: Number(draft.enjoyed_sick) || 0,
        tardy_count: Math.trunc(Number(draft.tardy_count)) || 0,
        undertime_hours: Number(draft.undertime_hours) || 0,
        undertime_minutes: Number(draft.undertime_minutes) || 0,
        undertime_days_equiv: Number(draft.undertime_days_equiv) || 0,
        total_spent_vacation: Number(draft.total_spent_vacation) || 0,
        total_spent_sick: Number(draft.total_spent_sick) || 0,
        lwop_vacation: Number(draft.lwop_vacation) || 0,
        lwop_sick: Number(draft.lwop_sick) || 0,
        balance_vacation: Number(draft.balance_vacation) || 0,
        balance_sick: Number(draft.balance_sick) || 0,
        maternity_leave: Number(draft.maternity_leave) || 0,
        remarks: draft.remarks || null,
      });

      setIsAddingRow(false);
      setDraft(emptyDraft());
      setIsDirty(false);
      router.refresh();
    });
  };

  const numCell = (field: keyof DraftRow, step = 'any') => (
    <td className="border px-1 py-1">
      <input
        type="number"
        min={0}
        step={step}
        value={draft[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        className={cellInput}
      />
    </td>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddEntry} disabled={isAddingRow}>
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
            {isAddingRow && (
              <tr className="bg-primary/5 border-b">
                {/* Year */}
                <td className="min-w-[64px] border px-1 py-1">
                  <input
                    type="number"
                    min={1900}
                    max={currentYear + 5}
                    value={draft.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className={cellInput}
                    autoFocus
                  />
                </td>
                {/* Month */}
                <td className="min-w-[90px] border px-1 py-1">
                  <select
                    value={draft.month}
                    onChange={(e) => handleChange('month', e.target.value)}
                    className="focus:ring-primary focus:border-primary w-full rounded-sm border border-transparent bg-transparent px-1 py-0.5 text-xs focus:ring-1 focus:outline-none"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </td>
                {numCell('earned_vacation')}
                {numCell('earned_sick')}
                {numCell('enjoyed_vacation')}
                {numCell('enjoyed_sick')}
                {numCell('tardy_count', '1')}
                {numCell('undertime_hours')}
                {numCell('undertime_minutes')}
                {numCell('undertime_days_equiv')}
                {numCell('total_spent_vacation')}
                {numCell('total_spent_sick')}
                {numCell('lwop_vacation')}
                {numCell('lwop_sick')}
                {numCell('balance_vacation')}
                {numCell('balance_sick')}
                {numCell('maternity_leave')}
                {/* Remarks */}
                <td className="min-w-[100px] border px-1 py-1">
                  <input
                    type="text"
                    value={draft.remarks}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    placeholder="Optional..."
                    className={cellInput}
                  />
                </td>
                {/* Actions */}
                <td className="border px-1 py-1">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive h-6 w-6"
                      onClick={handleCancel}
                      disabled={isPending}
                      title="Cancel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    {isDirty && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={handleSubmit}
                        disabled={isPending}
                        title="Save entry"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {data.length ? (
              data.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-muted/30 border-b transition-colors"
                >
                  <td className="border px-3 py-1 font-medium">{entry.year}</td>
                  <td className="border px-3 py-1 whitespace-nowrap">
                    {entry.month}
                  </td>
                  <td className={td}>{entry.earned_vacation ?? 0}</td>
                  <td className={td}>{entry.earned_sick ?? 0}</td>
                  <td className={td}>{entry.enjoyed_vacation ?? 0}</td>
                  <td className={td}>{entry.enjoyed_sick ?? 0}</td>
                  <td className={td}>{entry.tardy_count ?? 0}</td>
                  <td className={td}>{entry.undertime_hours ?? 0}</td>
                  <td className={td}>{entry.undertime_minutes ?? 0}</td>
                  <td className={td}>{entry.undertime_days_equiv ?? 0}</td>
                  <td className={td}>{entry.total_spent_vacation ?? 0}</td>
                  <td className={td}>{entry.total_spent_sick ?? 0}</td>
                  <td className={td}>{entry.lwop_vacation ?? 0}</td>
                  <td className={td}>{entry.lwop_sick ?? 0}</td>
                  <td className={`${td} font-semibold`}>
                    {entry.balance_vacation ?? 0}
                  </td>
                  <td className={`${td} font-semibold`}>
                    {entry.balance_sick ?? 0}
                  </td>
                  <td className={td}>{entry.maternity_leave ?? 0}</td>
                  <td className="text-muted-foreground max-w-[140px] truncate border px-2 py-1">
                    {entry.remarks || '—'}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            toggleOpen?.(true, 'edit', { ...entry })
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Entry
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            toggleOpen?.(true, 'delete', { ...entry })
                          }
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Entry
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={19}
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
