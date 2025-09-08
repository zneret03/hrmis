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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import { Badge } from '@/components/ui/badge'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { AttendanceSummaryDB } from '@/lib/types/attendance'
import { months } from '@/helpers/months'
import { getPreviousYears } from '@/helpers/getPreviousYears'

interface RenderedTableData {
  data: AttendanceSummaryDB[]
}

export function RenderedTable({ data }: RenderedTableData) {
  const [currentMonth, setCurrentMonth] = React.useState<string>('')
  const [currentYear, setCurrentYear] = React.useState<string>('')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const monthParams = searchParams.get('month')
  const yearParams = searchParams.get('year')

  const onFilterMonth = (month: string): void => {
    if (month === '0') {
      router.replace(pathname)
      setCurrentMonth('')
      return
    }

    if (!yearParams) {
      router.replace(`${pathname}?month=${month}`)
      setCurrentMonth(month)
      return
    }

    router.replace(`${pathname}?month=${month}&year=${yearParams}`)
    setCurrentMonth(month)
  }

  const onFilterYear = (year: string): void => {
    router.replace(
      `${pathname}?month=${searchParams.get('month')}&year=${year}`
    )
    setCurrentYear(year)
  }

  const columns: ColumnDef<AttendanceSummaryDB>[] = React.useMemo(
    () => [
      {
        accessorKey: 'timestamp',
        header: 'Date Timestamp',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>
              {format(
                row.getValue('timestamp'),
                "MMMM dd, yyyy hh:mm aaaaa'm'"
              )}
            </div>
          )
        }
      },
      {
        accessorKey: 'total_hours',
        header: 'Total Hours',
        cell: function ({ row }) {
          return <div className='capitalize'>{row.original.total_hours}hr</div>
        }
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: function ({ row }) {
          return <Badge variant='outline'>{row.original.status}</Badge>
        }
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: function ({ row }) {
          return (
            <div className='capitalize'>
              {format(
                row.getValue('created_at'),
                "MMMM dd, yyyy hh:mm aaaaa'm'"
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
                    row.getValue('updated_at'),
                    "MMMM dd, yyyy hh:mm aaaaa'm'"
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

  const monthKeys: string[] = Object.keys(months)
  const yearsList = getPreviousYears()
  const todayYear = new Date().getFullYear()
  const todayMonth = (new Date().getMonth() + 1).toString()

  return (
    <div className='w-full'>
      <div className='flex items-center justify-end gap-2 py-4'>
        <Select
          value={currentYear || todayYear.toString()}
          onValueChange={(e) => onFilterYear(e)}
          disabled={!monthParams}
        >
          <SelectTrigger className='w-[10rem]'>
            <SelectValue placeholder='Select year' />
          </SelectTrigger>
          <SelectContent>
            {yearsList.map((item, index) => (
              <SelectItem key={index} value={item.toString()}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            currentMonth ||
            (monthParams as string) ||
            todayMonth.padStart(2, '0')
          }
          onValueChange={(e) => onFilterMonth(e)}
        >
          <SelectTrigger className='w-[10rem]'>
            <SelectValue placeholder='Select month' />
          </SelectTrigger>
          <SelectContent>
            {monthKeys.map((item) => (
              <SelectItem key={item} value={months[item]}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
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
    </div>
  )
}
