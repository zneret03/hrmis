import { JSX } from 'react';
import { Container } from '@/components/custom/Container';
import { AttendanceReportTable } from './components/AttendanceReportTable';
import {
  getAttendanceReport,
  type AttendancePeriod,
} from '@/services/attendance/attendance-report.services';

const PERIODS: AttendancePeriod[] = ['weekly', 'monthly', 'yearly'];

export default async function AttendanceReportPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; date?: string }>;
}): Promise<JSX.Element> {
  const { period, date } = await searchParams;

  const activePeriod: AttendancePeriod = PERIODS.includes(
    period as AttendancePeriod,
  )
    ? (period as AttendancePeriod)
    : 'monthly';
  const anchor = date || new Date().toISOString().slice(0, 10);

  const report = await getAttendanceReport(activePeriod, anchor);

  return (
    <Container
      title="Attendance Report"
      description="View or export employee attendance (late & undertime) by week, month, or year"
    >
      <AttendanceReportTable
        {...{
          period: activePeriod,
          anchor,
          start: report.start,
          end: report.end,
          rows: report.rows,
        }}
      />
    </Container>
  );
}
