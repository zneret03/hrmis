import { NextRequest } from 'next/server';
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
  csvResponse,
} from '../../../helpers/response';
import { createClient } from '@/config';
import { toCSV } from '@/app/api/helpers/csvHelpers';
import { fetchAllRows } from '@/app/api/helpers/paginated-data';
import {
  computeDayAttendance,
  getPeriodRange,
  localDayKey,
  type AttendancePeriod,
} from '@/helpers/attendance';
import { Users } from '@/lib/types/users';

interface ReportRow {
  employee_id: string;
  name: string;
  date: string;
  time_in: string;
  time_out: string;
  worked_hours: string;
  late: string;
  undertime: string;
}

const CSV_COLUMNS = [
  { key: 'employee_id' as const, header: 'Employee ID' },
  { key: 'name' as const, header: 'Name' },
  { key: 'date' as const, header: 'Date' },
  { key: 'time_in' as const, header: 'Time In' },
  { key: 'time_out' as const, header: 'Time Out' },
  { key: 'worked_hours' as const, header: 'Worked Hours' },
  { key: 'late' as const, header: 'Late' },
  { key: 'undertime' as const, header: 'Undertime' },
];

function isPeriod(value: string | null): value is AttendancePeriod {
  return value === 'weekly' || value === 'monthly' || value === 'yearly';
}

function parseAnchor(dateParam: string | null): Date {
  if (dateParam) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateParam);
    if (m) {
      return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    }
  }
  return new Date();
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const url = req.nextUrl.searchParams;
    const period = isPeriod(url.get('period')) ? url.get('period')! : 'monthly';
    const anchor = parseAnchor(url.get('date'));
    const format = url.get('format');
    const { start, end } = getPeriodRange(period as AttendancePeriod, anchor);

    // Coarse raw-timestamp bounds for the period (local = raw - 8h, so a local
    // day's punches can land on the next UTC day). The exact per-day filter runs
    // in JS below. Batched so nothing is dropped at the 1000-row cap.
    const lower = `${start}T00:00:00.000Z`;
    const upperDate = new Date(`${end}T00:00:00.000Z`);
    upperDate.setUTCDate(upperDate.getUTCDate() + 2);
    const upper = upperDate.toISOString();

    const [
      { data: biometrics, error: bioError },
      { data: users, error: usersError },
    ] = await Promise.all([
      fetchAllRows<{ employee_id: string | null; timestamp: string }>(() =>
        supabase
          .from('biometrics')
          .select('employee_id, timestamp')
          .is('archived_at', null)
          .gte('timestamp', lower)
          .lte('timestamp', upper)
          .order('timestamp', { ascending: true }),
      ),
      fetchAllRows<
        Pick<Users, 'employee_id' | 'first_name' | 'middle_name' | 'last_name'>
      >(() =>
        supabase
          .from('users')
          .select('employee_id, first_name, middle_name, last_name')
          .is('archived_at', null),
      ),
    ]);

    if (bioError) return badRequestResponse({ error: bioError.message });
    if (usersError) return badRequestResponse({ error: usersError.message });

    const nameByEmployeeId = new Map<string, string>();
    for (const user of (users ?? []) as Pick<
      Users,
      'employee_id' | 'first_name' | 'middle_name' | 'last_name'
    >[]) {
      if (user.employee_id) {
        nameByEmployeeId.set(
          user.employee_id,
          [user.last_name, user.first_name, user.middle_name]
            .filter(Boolean)
            .join(', '),
        );
      }
    }

    // Group punches by employee + local day, within the period.
    const grouped = new Map<string, string[]>();
    for (const row of (biometrics ?? []) as {
      employee_id: string | null;
      timestamp: string;
    }[]) {
      if (!row.employee_id) continue;
      const day = localDayKey(row.timestamp);
      if (day < start || day > end) continue;
      const key = `${row.employee_id}|${day}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(row.timestamp);
    }

    const rows: ReportRow[] = [];
    for (const [key, timestamps] of grouped) {
      const [employeeId, day] = key.split('|');
      const d = computeDayAttendance(timestamps);
      rows.push({
        employee_id: employeeId,
        name: nameByEmployeeId.get(employeeId) ?? '',
        date: day,
        time_in: d.timeIn ?? 'N/A',
        time_out: d.timeOut ?? 'N/A',
        worked_hours: d.incomplete ? 'N/A' : String(d.workedHours),
        late: d.isLate ? 'Yes' : 'No',
        undertime: d.isUndertime ? 'Yes' : 'No',
      });
    }

    rows.sort((a, b) =>
      a.date === b.date
        ? a.name.localeCompare(b.name)
        : a.date.localeCompare(b.date),
    );

    // Export: the whole period.
    if (format === 'csv') {
      return csvResponse(
        toCSV(rows, CSV_COLUMNS),
        `attendance-${period}-${start}_to_${end}.csv`,
      );
    }

    // View: one page of the aggregated rows.
    const page = Math.max(Number(url.get('page') || 1), 1);
    const perPage = Number(url.get('perPage') || 10);
    const from = (page - 1) * perPage;
    const paged = rows.slice(from, from + perPage);

    return successResponse({
      message: 'Successfully fetched attendance report',
      data: {
        period,
        start,
        end,
        rows: paged,
        count: rows.length,
        totalPages: Math.ceil(rows.length / perPage),
        currentPage: page,
      },
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
}
