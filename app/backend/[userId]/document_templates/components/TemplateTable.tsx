'use client';

import * as React from 'react';
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
  VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTemplateDialog } from '@/services/template/state/template-state';
import { useShallow } from 'zustand/shallow';
import { format, subHours } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/custom/Pagination';
import { Pagination as PaginationType } from '@/lib/types/pagination';
import { useRouter, usePathname } from 'next/navigation';
import { debounce } from 'lodash';
import Link from 'next/link';
import { TemplateDB } from '@/lib/types/template';

interface LeaveTableData extends PaginationType {
  templates: TemplateDB[];
}

export function TemplateTable({
  templates: data,
  totalPages,
  currentPage,
  count,
}: LeaveTableData) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { toggleOpen } = useTemplateDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  const pathname = usePathname();
  const router = useRouter();

  const onDebounce = React.useMemo(
    () =>
      debounce((value) => {
        if (!!value) {
          router.replace(`${pathname}?page=${currentPage}&search=${value}`);
          return;
        }

        router.replace(`${pathname}?page=${currentPage}`);
      }, 500),
    [pathname, router, currentPage],
  );

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    onDebounce(value);
  };

  const addNewTemplate = (): void => {
    router.push(`${pathname}/template_editor?document=pdf-editor`);
  };

  const editTemplate = React.useCallback(
    (templateId: string) => {
      router.push(`${pathname}/${templateId}`);
    },
    [router, pathname],
  );

  const columns: ColumnDef<TemplateDB>[] = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: function ({ row }) {
          return (
            <div className="flex items-center gap-2">
              <div className="font-semibold capitalize">
                {row.getValue('name')}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'file',
        header: 'Requested File',
        cell: function ({ row }) {
          return (
            <div>
              {!!row.original.file ? (
                <Link
                  href={row.original.file || ''}
                  className="text-primary font-semibold underline"
                  target="_blank"
                >
                  Download
                </Link>
              ) : (
                'N/A'
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: function ({ row }) {
          return (
            <div className="flex items-center gap-2">
              <div className="font-semibold capitalize">
                {row.getValue('type')}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: function ({ row }) {
          return (
            <div className="capitalize">
              {format(
                subHours(row.getValue('created_at'), 8),
                'MMMM d, yyyy, h:mm:ss a',
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: function ({ row }) {
          return (
            <div className="capitalize">
              {row.getValue('updated_at')
                ? format(
                    row.getValue('updated_at'),
                    "MMMM dd, yyyy hh:mm aaaaa'm'",
                  )
                : 'N/A'}
            </div>
          );
        },
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
                onClick={() => editTemplate(row.original.id as string)}
              >
                <Pencil />
                Edit info
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toggleOpen?.(true, 'delete', { ...row.original })
                }
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [editTemplate, toggleOpen],
  );

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
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search categories..."
          onChange={(event) => onSearch(event)}
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
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

          <Button onClick={addNewTemplate}>
            <Plus className="h-5 w-5" />
            Add templates
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
      <Pagination {...{ totalPages, currentPage, count }} />
    </div>
  );
}
