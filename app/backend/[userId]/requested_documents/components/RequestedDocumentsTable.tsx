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
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  Trash,
  CircleX
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { format, subHours } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  CertificateType,
  useCertificates
} from '@/services/certificates/state/use-certificate'
import { useShallow } from 'zustand/shallow'
import { Pagination } from '@/components/custom/Pagination'
import { Pagination as PaginationType } from '@/lib/types/pagination'
import { useRouter, usePathname } from 'next/navigation'
import { debounce } from 'lodash'
import { Certificates } from '@/lib/types/certificates'

interface RequestedDocumentsTableData extends PaginationType {
  certificates: Partial<Certificates>[]
}

const certificateType: { [key: string]: string } = {
  service_record: 'Service Record',
  coe: 'Certificate of Employment',
  nosa: 'NOSA',
  coec: 'Certificate of Employment with Compensation'
}

export function CertificatesTable({
  certificates: data,
  totalPages,
  currentPage,
  count
}: RequestedDocumentsTableData) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const { toggleOpen } = useCertificates(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog }))
  )

  const pathname = usePathname()
  const router = useRouter()

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

  const columns: ColumnDef<Partial<Certificates>>[] = React.useMemo(
    () => [
      {
        accessorKey: 'user.email',
        header: 'Email',
        cell: function ({ row }) {
          return (
            <div className='font-semibold'>{row.original.users?.email}</div>
          )
        }
      },
      {
        accessorKey: 'title',
        header: 'Request Title',
        cell: function ({ row }) {
          return <div>{row.original.title}</div>
        }
      },
      {
        accessorKey: 'certificated_type',
        header: 'Requested Document',
        cell: function ({ row }) {
          return (
            <Badge variant='outline'>
              {certificateType[row.original.certificate_type as string]}
            </Badge>
          )
        }
      },
      {
        accessorKey: 'certificated_status',
        header: 'Status',
        cell: function ({ row }) {
          return (
            <Badge variant='outline' className='capitalize'>
              {row.original.certificate_status}
            </Badge>
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
              {['pending', 'disapproved'].includes(
                row?.original?.certificate_status as string
              ) && (
                <DropdownMenuItem
                  onClick={() =>
                    toggleOpen?.(
                      true,
                      'approve',
                      row.original.certificate_type as CertificateType,
                      {
                        ...(row.original as Certificates)
                      }
                    )
                  }
                >
                  <CheckCircle />
                  Approve
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() =>
                  toggleOpen?.(
                    true,
                    'disapprove',
                    row.original.certificate_type as CertificateType,
                    {
                      ...(row.original as Certificates)
                    }
                  )
                }
              >
                <CircleX />
                Disapprove
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toggleOpen?.(true, 'delete', null, {
                    ...(row.original as Certificates)
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
    [toggleOpen]
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
        <Input
          placeholder='Search document by title...'
          onChange={(event) => onSearch(event)}
          className='max-w-sm'
        />

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
