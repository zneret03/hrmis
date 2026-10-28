import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { PreviousButton } from '@/components/custom/PreviousButton';
import { Badge } from '@/components/ui/badge';
import { ServiceRecordTable } from '../components/ServiceRecordTable';
import { getServiceRecords } from '@/services/service_record/service-record.services';
import { fetchUser } from '@/services/users/users.services';
import { getAllEmployeeStatus } from '@/services/employee_status/employee-status.services';
import { employeeName } from '@/helpers/employeeName';

export default async function EmployeeServiceRecordPage({
  params,
}: {
  params: Promise<{ userId: string; employeeId: string }>;
}): Promise<JSX.Element> {
  const { employeeId } = await params;

  // A personal service history is small; load it all like the leave card.
  const [list, employee, statuses] = await Promise.all([
    getServiceRecords({ userId: employeeId, perPage: 1000 }),
    fetchUser(employeeId),
    getAllEmployeeStatus(),
  ]);

  const statusNames = statuses.map((status) => status.name);

  return (
    <Container
      title="Employee Service Record"
      description="Service record entries encoded by HR/Admin."
    >
      <PreviousButton />
      <>
        <div className="flex flex-col gap-1">
          <div className="space-y-4">
            <span className="text-3xl font-semibold capitalize">
              {employeeName(employee) ?? '—'}
            </span>
            <p className="text-muted-foreground text-sm">{employee?.email}</p>
            {employee?.employee_id && (
              <Badge variant="outline" className="text-xl">
                ID: {employee.employee_id}
              </Badge>
            )}
          </div>
        </div>

        <ServiceRecordTable
          records={list.records}
          userId={employeeId}
          statuses={statusNames}
        />
      </>
    </Container>
  );
}
