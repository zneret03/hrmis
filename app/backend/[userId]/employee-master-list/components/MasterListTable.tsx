'use client';

import { JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PaginationControls } from '@/components/custom/PaginationControls';
import { MasterListRow } from '@/services/users/master-list.services';
import { EmployeeStatus } from '@/lib/types/employee_status';

interface MasterListTableProps {
  employees: MasterListRow[];
  statuses: Pick<EmployeeStatus, 'id' | 'name'>[];
  activeStatus: string;
  totalPages: number;
  currentPage: number;
  count: number;
}

export function MasterListTable({
  employees,
  statuses,
  activeStatus,
  totalPages,
  currentPage,
  count,
}: MasterListTableProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  const filters = [{ id: 'all', name: 'All' }, ...statuses];

  const onFilter = (value: string): void => {
    router.push(`${pathname}?status=${encodeURIComponent(value)}`);
  };

  const onExport = (): void => {
    window.location.href = `/api/protected/users/master-list?status=${encodeURIComponent(
      activeStatus,
    )}&format=csv`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const value = filter.id === 'all' ? 'all' : filter.name;
            const isActive = activeStatus === value;
            return (
              <Button
                key={filter.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilter(value)}
              >
                {filter.name}
              </Button>
            );
          })}
        </div>

        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="text-muted-foreground mb-2 text-sm">
        {count} employee{count === 1 ? '' : 's'}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Employment Status</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length ? (
              employees.map((employee, index) => (
                <TableRow key={`${employee.employee_id}-${index}`}>
                  <TableCell>{employee.employee_id || 'N/A'}</TableCell>
                  <TableCell className="font-semibold capitalize">
                    {employee.name || 'N/A'}
                  </TableCell>
                  <TableCell className="capitalize">
                    {employee.gender || 'N/A'}
                  </TableCell>
                  <TableCell
                    className={cn('capitalize', {
                      'text-muted-foreground': !employee.employment_status,
                    })}
                  >
                    {employee.employment_status || 'N/A'}
                  </TableCell>
                  <TableCell className="capitalize">
                    {employee.position || 'N/A'}
                  </TableCell>
                  <TableCell>{employee.email || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
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
