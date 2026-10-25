'use client';

import { JSX, useState } from 'react';
import { Eye, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/custom/Spinner';
import {
  getEmployeesByCategory,
  type EmployeeCategory,
  type CategoryRow,
} from '@/services/users/by-category.services';

interface CategoryActionsProps {
  category: EmployeeCategory;
  title: string;
}

export function CategoryActions({
  category,
  title,
}: CategoryActionsProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [header, setHeader] = useState('');
  const [rows, setRows] = useState<CategoryRow[]>([]);

  const onView = async (): Promise<void> => {
    setOpen(true);
    setIsLoading(true);
    try {
      const { header: columnHeader, employees } =
        await getEmployeesByCategory(category);
      setHeader(columnHeader);
      setRows(employees);
    } finally {
      setIsLoading(false);
    }
  };

  const onExport = (): void => {
    window.location.href = `/api/protected/users/by-category?category=${category}&format=csv`;
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={onView}>
        <Eye className="h-4 w-4" />
        View
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[48rem]">
          <DialogHeader>
            <DialogTitle>{title} — Employee List</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>{header}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length ? (
                    rows.map((row, index) => (
                      <TableRow key={`${row.employee_id}-${index}`}>
                        <TableCell>{row.employee_id || 'N/A'}</TableCell>
                        <TableCell className="font-semibold capitalize">
                          {row.name || 'N/A'}
                        </TableCell>
                        <TableCell className="capitalize">
                          {row.value || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
