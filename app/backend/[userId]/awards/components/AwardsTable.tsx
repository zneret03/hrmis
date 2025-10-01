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
import { ChevronDown, Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TooltipComponent } from '@/components/custom/Tooltip'
import { Badge } from '@/components/ui/badge'
import { awardTypeCast } from '@/app/helpers/constants'
import { format, subHours } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useAwards } from '@/services/awards/state/use-awards'
import { useShallow } from 'zustand/shallow'
import { Pagination } from '@/components/custom/Pagination'
import { Pagination as PaginationType } from '@/lib/types/pagination'
import { useRouter, usePathname } from 'next/navigation'
import { debounce } from 'lodash'
import { avatarName } from '@/helpers/avatarName'
import { Awards, YearThreshold } from '@/lib/types/awards'

interface AwardsData extends PaginationType {
  awards: Awards[]
  yearThreshold?: YearThreshold
}

export function EmployeeAwardsTable({
  awards: data,
  yearThreshold,
  totalPages,
  currentPage,
  count
}: AwardsData) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const { toggleOpen } = useAwards(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog }))
  )

  const pathname = usePathname()
  const router = useRouter()

  const isDashboard = pathname.endsWith('/dashboard')

  const onDebounce = React.useMemo(
    () =>
      debounce((value) => {
        if (!!value) {
          router.replace(`${pathname}?page=${currentPage}&search=${value}`)
          return
        }

        router.replace(`${pathname}?page=${currentPage}`)
      }, 500),
    [pathname, router, currentPage]
  )

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    onDebounce(value)
  }

  const showMoreAwards = (): void => {
    router.replace(`${pathname}/awards`)
  }

  const columns: ColumnDef<Awards>[] = React.useMemo(
    () => [
      {
        accessorKey: 'users.email',
        header: 'User',
        cell: function ({ row }) {
          return (
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage
                  className='object-cover'
                  src={row.original?.users.avatar ?? ''}
                  alt={row.original?.users?.email}
                />
                <AvatarFallback className='rounded-lg fill-blue-500 bg-blue-400 text-white font-semibold capitalize'>
                  {avatarName(row.original?.users?.email)}
                </AvatarFallback>
              </Avatar>
              <div>{row.original.users?.email}</div>
            </div>
          )
        }
      },
      {
        accessorKey: 'title',
        header: 'Award Title',
        cell: function ({ row }) {
          return (
            <div className='font-medium capitalize'>{row.original.title}</div>
          )
        }
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: function ({ row }) {
          return (
            <TooltipComponent value={row.original.description as string}>
              <div className='capitalize line-clamp-1 text-ellipsis w-30'>
                {row.original.description}
              </div>
            </TooltipComponent>
          )
        }
      },
      {
        accessorKey: 'awards_type',
        header: 'Awards Type',
        cell: function ({ row }) {
          return (
            <Badge variant='outline'>
              {awardTypeCast[row.original.award_type]}
            </Badge>
          )
        }
      },
      {
        accessorKey: 'read',
        header: 'Status',
        cell: function ({ row }) {
          return (
            <Badge variant='outline' className='capitalize'>
              {!row.original.read ? 'unread' : 'read'}
            </Badge>
          )
        }
      },
      {
        accessorKey: 'year',
        header: 'Year',
        cell: function ({ row }) {
          return <div>{row.original.year}</div>
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
                    row.getValue('updated_at'),
                    "MMMM dd, yyyy hh:mm aaaaa'm'"
                  )
                : 'N/A'}
            </div>
          )
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() =>
                  toggleOpen?.(true, 'edit', {
                    ...row.original,
                    yearThreshold: yearThreshold as YearThreshold
                  })
                }
              >
                <Pencil />
                Edit info
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toggleOpen?.(true, 'delete', {
                    ...row.original,
                    yearThreshold: yearThreshold as YearThreshold
                  })
                }
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [toggleOpen, yearThreshold]
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
      <div className='flex items-center justify-end py-4'>
        {!isDashboard && (
          <Input
            placeholder='Search user by email...'
            onChange={(event) => onSearch(event)}
            className='max-w-sm'
          />
        )}

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

          {isDashboard && data.length >= 5 && (
            <Button variant='outline' onClick={() => showMoreAwards()}>
              <Plus className='w-5 h-5' />
              Show more
            </Button>
          )}

          {!isDashboard && (
            <Button onClick={() => toggleOpen?.(true, 'add', null)}>
              <Plus className='w-5 h-5' />
              Nominate
            </Button>
          )}
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

      {data.length > 0 && (
        <Pagination {...{ totalPages, currentPage, count }} />
      )}
    </div>
  )
}
