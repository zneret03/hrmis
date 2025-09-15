'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { format, subHours } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/custom/Pagination'
import { Pagination as PaginationType } from '@/lib/types/pagination'
import { usePathname, permanentRedirect } from 'next/navigation'
import { AttendanceDB } from '@/lib/types/attendance'

interface AttendanceTableData extends PaginationType {
  data: AttendanceDB[]
}

export function AttendanceTable({
  data,
  totalPages,
  currentPage,
  count
}: AttendanceTableData) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const pathname = usePathname()

  const goAttendanceSummary = (id: string): void => {
    permanentRedirect(`${pathname}/${id}`)
  }

  const columns: ColumnDef<AttendanceDB>[] = React.useMemo(
    () => [
      {
        accessorKey: 'employee_id',
        header: 'Employee ID',
        cell: function ({ row }) {
          return (
            <div className='flex items-center gap-2'>
              <div className='capitalize font-semibold'>
                {row.original.users?.employee_id}
              </div>
            </div>
          )
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: function ({ row }) {
          return <div className='font-medium'>{row.original.users?.email}</div>
        }
      },
      {
        accessorKey: 'month',
        header: 'Month',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>
              {format(row.getValue('month'), 'MMMM')}
            </div>
          )
        }
      },
      {
        accessorKey: 'days_present',
        header: 'Days Present',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>{row.getValue('days_present')}</div>
          )
        }
      },
      {
        accessorKey: 'days_absent',
        header: 'Days Absent',
        cell: function ({ row }) {
          return <div className='capitalize'>{row.getValue('days_absent')}</div>
        }
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>
              {format(
                subHours(row.getValue('created_at'), 8),
                'MMMM d, yyyy, h:mm:ss a'
              )}
            </div>
          )
        }
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>
              {row.getValue('updated_at')
                ? format(
                    subHours(row.getValue('created_at'), 8),
                    'MMMM d, yyyy, h:mm:ss a'
                  )
                : 'N/A'}
            </div>
          )
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map(function (column) {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='rounded-md border'>
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
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                  onClick={() =>
                    goAttendanceSummary(
                      row.original.users?.employee_id as string
                    )
                  }
                  className='cursor-pointer'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination {...{ totalPages, currentPage, count }} />
    </div>
  )
}
