'use client';

import { JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type AttendancePeriod,
  type AttendanceReportRow,
} from '@/services/attendance/attendance-report.services';

interface AttendanceReportTableProps {
  period: AttendancePeriod;
  anchor: string;
  start: string;
  end: string;
  rows: AttendanceReportRow[];
}

const PERIODS: { value: AttendancePeriod; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function AttendanceReportTable({
  period,
  anchor,
  start,
  end,
  rows,
}: AttendanceReportTableProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (nextPeriod: AttendancePeriod, nextDate: string): void => {
    router.push(`${pathname}?period=${nextPeriod}&date=${nextDate}`);
  };

  const onExport = (): void => {
    window.location.href = `/api/protected/attendance/report?period=${period}&date=${anchor}&format=csv`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {PERIODS.map((item) => (
            <Button
              key={item.value}
              variant={period === item.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigate(item.value, anchor)}
            >
              {item.label}
            </Button>
          ))}
          <input
            type="date"
            value={anchor}
            onChange={(event) => navigate(period, event.target.value)}
            aria-label="Anchor date"
            className="border-input h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
          />
        </div>

        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="text-muted-foreground mb-2 text-sm">
        {start && end ? `${start} to ${end} · ` : ''}
        {rows.length} record{rows.length === 1 ? '' : 's'}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Worked Hours</TableHead>
              <TableHead>Late</TableHead>
              <TableHead>Undertime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row, index) => (
                <TableRow key={`${row.employee_id}-${row.date}-${index}`}>
                  <TableCell>{row.employee_id || 'N/A'}</TableCell>
                  <TableCell className="font-semibold capitalize">
                    {row.name || 'N/A'}
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time_in}</TableCell>
                  <TableCell>{row.time_out}</TableCell>
                  <TableCell>{row.worked_hours}</TableCell>
                  <TableCell>
                    {row.late === 'Yes' ? (
                      <Badge className="bg-red-500/15 text-red-600">Late</Badge>
                    ) : (
                      <span className="text-muted-foreground">On time</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.undertime === 'Yes' ? (
                      <Badge className="bg-amber-500/15 text-amber-600">
                        Undertime
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No records for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
