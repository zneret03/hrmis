import { createClient } from '@/config';
import {
  generalErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/app/api/helpers/response';
import { format, getDate, getMonth, getYear, subHours } from 'date-fns';
import { DTRDayRecord, DTRMonth } from '@/lib/types/biometrics';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorizedResponse({ message: 'Unauthorized' });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('employee_id, first_name, last_name, position')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.employee_id) {
      return generalErrorResponse({ message: 'Employee ID not found' });
    }

    const { data: biometrics, error } = await supabase
      .from('biometrics')
      .select('id, employee_id, timestamp, type')
      .eq('employee_id', userData.employee_id)
      .is('archived_at', null)
      .order('timestamp', { ascending: true })
      .limit(10000);

    if (error) {
      return generalErrorResponse({ message: error.message });
    }

    // Group records by month → day, preserving chronological order within each day.
    // Slot assignment is positional (1st=AM in, 2nd=AM out, 3rd=PM in, 4th=PM out)
    // because Philippine biometric devices record all punches with the same type.
    const monthMap: Record<string, Record<number, string[]>> = {};

    for (const record of biometrics ?? []) {
      const ts = subHours(new Date(record.timestamp), 8);
      const monthKey = `${getYear(ts)}-${String(getMonth(ts) + 1).padStart(2, '0')}`;
      const day = getDate(ts);

      if (!monthMap[monthKey]) monthMap[monthKey] = {};
      if (!monthMap[monthKey][day]) monthMap[monthKey][day] = [];

      monthMap[monthKey][day].push(record.timestamp);
    }

    const formatTime = (ts?: string): string | null => {
      if (!ts) return null;
      return format(subHours(new Date(ts), 8), 'hh:mm a');
    };

    const dtrData: DTRMonth[] = Object.keys(monthMap)
      .sort()
      .map((monthKey) => {
        const [year, month] = monthKey.split('-').map(Number);
        const monthLabel = format(new Date(year, month - 1, 1), 'MMMM yyyy');
        const days = monthMap[monthKey];

        const records: DTRDayRecord[] = Object.keys(days)
          .map(Number)
          .sort((a, b) => a - b)
          .map((day) => {
            const punches = days[day];
            return {
              day,
              date: format(new Date(year, month - 1, day), 'yyyy-MM-dd'),
              morning_in: formatTime(punches[0]),
              morning_out: formatTime(punches[1]),
              afternoon_in: formatTime(punches[2]),
              afternoon_out: formatTime(punches[3]),
            };
          });

        return { month: monthKey, month_label: monthLabel, records };
      });

    return successResponse({
      message: 'Successfully fetched biometrics',
      data: {
        dtr: dtrData,
        employee: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          position: userData.position,
          employee_id: userData.employee_id as string,
        },
      },
    });
  } catch (error) {
    return generalErrorResponse({ message: error });
  }
}
