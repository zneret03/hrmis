'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLeaveCardDialog } from '@/services/leave_card/states/leave-card-dialog';
import { useShallow } from 'zustand/shallow';
import { LeaveCardEntry } from '@/lib/types/leave_card_entries';

interface LeaveCardTableProps {
  data: LeaveCardEntry[];
  userId: string;
}

const th = 'border px-2 py-1 font-semibold text-center align-middle';
const thSub = 'border px-2 py-1 font-medium text-center text-muted-foreground';
const td = 'border px-2 py-1 text-center';

export function LeaveCardTable({ data, userId }: LeaveCardTableProps) {
  const { toggleOpen } = useLeaveCardDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => toggleOpen?.(true, 'add', { user_id: userId })}>
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
