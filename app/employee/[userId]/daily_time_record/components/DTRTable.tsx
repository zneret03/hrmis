'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DTRDayRecord, DTRMonth } from '@/lib/types/biometrics';
import { DTREmployee } from '@/services/biometrics/biometrics.services';
import { buildPrintHTML } from '../helpers/DTRHtml';

interface DTRTableProps {
  dtr: DTRMonth[];
  employee: DTREmployee;
}

function DTRMonthSection({
  month,
  employee,
}: {
  month: DTRMonth;
  employee: DTREmployee;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<DTRDayRecord>[] = React.useMemo(
    () => [
      {
        accessorKey: 'day',
        header: () => <div className="text-center">Day</div>,
        cell: function ({ row }) {
          return (
            <div className="text-center font-medium">{row.getValue('day')}</div>
          );
        },
      },
      {
        accessorKey: 'morning_in',
        header: () => <div className="text-center">AM Arrival</div>,
        cell: function ({ row }) {
          return (
            <div className="text-center">
              {row.getValue('morning_in') ?? '—'}
            </div>
          );
        },
      },
      {
        accessorKey: 'morning_out',
        header: () => <div className="text-center">AM Departure</div>,
        cell: function ({ row }) {
          return (
            <div className="text-center">
              {row.getValue('morning_out') ?? '—'}
            </div>
          );
        },
      },
      {
        accessorKey: 'afternoon_in',
        header: () => <div className="text-center">PM Arrival</div>,
        cell: function ({ row }) {
          return (
            <div className="text-center">
              {row.getValue('afternoon_in') ?? '—'}
            </div>
          );
        },
      },
      {
        accessorKey: 'afternoon_out',
        header: () => <div className="text-center">PM Departure</div>,
        cell: function ({ row }) {
          return (
            <div className="text-center">
              {row.getValue('afternoon_out') ?? '—'}
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: month.records,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDownload = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(buildPrintHTML(month, employee));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">{month.month_label}</h2>
      <div className="flex items-center py-4">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map(function (column) {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(function (header) {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function DTRTable({ dtr, employee }: DTRTableProps) {
  if (!dtr.length) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No time records found.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {dtr.map((month) => (
        <DTRMonthSection key={month.month} month={month} employee={employee} />
      ))}
    </div>
  );
}
