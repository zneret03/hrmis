import { JSX } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ServiceRecordWithUser } from '@/lib/types/service_record';

interface ServiceRecordViewProps {
  records: ServiceRecordWithUser[];
}

export function ServiceRecordView({
  records,
}: ServiceRecordViewProps): JSX.Element {
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length ? (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-semibold capitalize">
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
                <TableCell>{record.remarks || 'N/A'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No service record entries yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
