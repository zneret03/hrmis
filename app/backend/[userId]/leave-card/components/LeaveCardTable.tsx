'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface LeaveCardTableProps {
  data: LeaveCardEntry[];
  userId: string;
}

export function LeaveCardTable({ data, userId }: LeaveCardTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { toggleOpen } = useLeaveCardDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  const columns: ColumnDef<LeaveCardEntry>[] = React.useMemo(
    () => [
      {
        accessorKey: 'year',
        header: 'Year',
        cell: ({ row }) => (
          <div className="font-medium">{row.original.year}</div>
        ),
      },
      {
        accessorKey: 'month',
        header: 'Month',
        cell: ({ row }) => (
          <div>
            {MONTHS.indexOf(row.original.month) > -1
              ? row.original.month
              : row.original.month}
          </div>
        ),
      },
      {
        id: 'earned_vacation',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">
              No. of Days Earned
            </div>
            <div>Vacation</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.earned_vacation ?? 0}</div>
        ),
      },
      {
        id: 'earned_sick',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">
              No. of Days Earned
            </div>
            <div>Sick</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.earned_sick ?? 0}</div>
        ),
      },
      {
        id: 'enjoyed_vacation',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Leave Enjoyed</div>
            <div>Vacation</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.enjoyed_vacation ?? 0}
          </div>
        ),
      },
      {
        id: 'enjoyed_sick',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Leave Enjoyed</div>
            <div>Sick</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.enjoyed_sick ?? 0}</div>
        ),
      },
      {
        accessorKey: 'tardy_count',
        header: () => (
          <div className="text-center text-xs leading-tight">
            No. Tardy for
            <br />5 mins. or more
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.tardy_count ?? 0}</div>
        ),
      },
      {
        id: 'undertime_hours',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Undertime</div>
            <div>Hours</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.undertime_hours ?? 0}</div>
        ),
      },
      {
        id: 'undertime_minutes',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Undertime</div>
            <div>Minutes</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.undertime_minutes ?? 0}
          </div>
        ),
      },
      {
        id: 'undertime_days_equiv',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Undertime</div>
            <div>Equiv. (Days)</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.undertime_days_equiv ?? 0}
          </div>
        ),
      },
      {
        id: 'total_spent_vacation',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">
              Total Leave Spent
            </div>
            <div>Vacation</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.total_spent_vacation ?? 0}
          </div>
        ),
      },
      {
        id: 'total_spent_sick',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">
              Total Leave Spent
            </div>
            <div>Sick</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.total_spent_sick ?? 0}
          </div>
        ),
      },
      {
        id: 'lwop_vacation',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Leave W/O Pay</div>
            <div>Vacation</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.lwop_vacation ?? 0}</div>
        ),
      },
      {
        id: 'lwop_sick',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Leave W/O Pay</div>
            <div>Sick</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.lwop_sick ?? 0}</div>
        ),
      },
      {
        id: 'balance_vacation',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Balance</div>
            <div>Vacation</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.original.balance_vacation ?? 0}
          </div>
        ),
      },
      {
        id: 'balance_sick',
        header: () => (
          <div className="text-center">
            <div className="text-muted-foreground text-xs">Balance</div>
            <div>Sick</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.original.balance_sick ?? 0}
          </div>
        ),
      },
      {
        accessorKey: 'maternity_leave',
        header: () => (
          <div className="text-center">
            Maternity
            <br />
            Leave
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.maternity_leave ?? 0}</div>
        ),
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks',
        cell: ({ row }) => (
          <div className="text-muted-foreground max-w-[120px] truncate text-sm">
            {row.original.remarks ?? '—'}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => toggleOpen?.(true, 'edit', { ...row.original })}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Entry
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() =>
                  toggleOpen?.(true, 'delete', { ...row.original })
                }
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [toggleOpen],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => toggleOpen?.(true, 'add', { user_id: userId })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No entries yet. Click &quot;Add Entry&quot; to encode data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
