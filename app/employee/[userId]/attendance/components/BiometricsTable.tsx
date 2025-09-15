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
// import { Control } from 'react-hook-form'
import { useForm } from 'react-hook-form'
// import { CalendarPicker } from '@/components/custom/CalendarPicker'
import { format, subHours } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/custom/Pagination'
import { Pagination as PaginationType } from '@/lib/types/pagination'
import { BiometricsDB } from '@/lib/types/biometrics'
import { biometricsStatus } from '@/app/backend/[userId]/attendance/components/helpers/constants'
// import { LeaveApplicationsFormData } from '@/lib/types/leave_application'

interface BiometricsTableData extends PaginationType {
  data: BiometricsDB[]
}

export function BiometricsTable({
  data,
  totalPages,
  currentPage,
  count
}: BiometricsTableData) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { control, watch } = useForm<{ date: Date }>()

  const dateFilter = watch('date')

  const columns: ColumnDef<BiometricsDB>[] = React.useMemo(
    () => [
      {
        accessorKey: 'employee_id',
        header: 'Employee ID',
        cell: function ({ row }) {
          return (
            <div className='capitalize font-semibold'>
              {row.getValue('employee_id')}
            </div>
          )
        }
      },
      {
        accessorKey: 'timestamp',
        header: 'Date Timestamp',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>
              {format(
                subHours(row.getValue('timestamp'), 8),
                'MMMM d, yyyy, h:mm:ss a'
              )}
            </div>
          )
        }
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>
              {biometricsStatus[row.original.type]}
            </div>
          )
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
                    subHours(row.getValue('updated_at_at'), 8),
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
        {/*
        <CalendarPicker
          title='Start and End Date'
          name='dateRange'
          control={
            control as Control<LeaveApplicationsFormData | { date: Date }>
          }
          isDisabled={false}
          date={dateFilter}
          mode='range'
        />*/}
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
