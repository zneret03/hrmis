'use client';

import { JSX } from 'react';
import { Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useShallow } from 'zustand/shallow';
import { PaginationControls } from '@/components/custom/PaginationControls';
import { useServiceRecordDialog } from '@/services/service_record/states/service-record-dialog';
import { ServiceRecordWithUser } from '@/lib/types/service_record';

interface ServiceRecordTableProps {
  records: ServiceRecordWithUser[];
  totalPages: number;
  currentPage: number;
}

const employeeName = (record: ServiceRecordWithUser): string => {
  const user = record.users;
  if (!user) return record.user_id;
  const name = [user.last_name, user.first_name].filter(Boolean).join(', ');
  return name || user.employee_id || record.user_id;
};

export function ServiceRecordTable({
  records,
  totalPages,
  currentPage,
}: ServiceRecordTableProps): JSX.Element {
  const { toggleOpen } = useServiceRecordDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-end py-4">
        <Button onClick={() => toggleOpen?.(true, 'add', null)}>
          <Plus className="h-5 w-5" />
          Add Service Record
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length ? (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-semibold capitalize">
                    {employeeName(record)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {record.position || 'N/A'}
                  </TableCell>
                  <TableCell className="capitalize">
                    {record.status || 'N/A'}
                  </TableCell>
                  <TableCell>{record.salary || 'N/A'}</TableCell>
                  <TableCell className="capitalize">
                    {record.station || 'N/A'}
                  </TableCell>
                  <TableCell>{record.from_date || 'N/A'}</TableCell>
                  <TableCell>{record.to_date || 'Present'}</TableCell>
                  <TableCell className="max-w-[16rem] truncate">
                    {record.remarks || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            toggleOpen?.(true, 'edit', {
                              id: record.id,
                              user_id: record.user_id,
                              position: record.position,
                              status: record.status,
                              salary: record.salary,
                              station: record.station,
                              from_date: record.from_date,
                              to_date: record.to_date,
                              remarks: record.remarks,
                            })
                          }
                        >
                          <Pencil />
                          Edit info
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleOpen?.(true, 'delete', { id: record.id })
                          }
                        >
                          <Trash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
