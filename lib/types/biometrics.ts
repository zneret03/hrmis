import { Database } from './db-types';

export type Biometrics = Database['public']['Tables']['biometrics']['Row'];

export type BiometricsDB = Pick<
  Biometrics,
  'id' | 'employee_id' | 'timestamp' | 'type'
>;

export interface DTRDayRecord {
  day: number;
  date: string;
  morning_in: string | null;
  morning_out: string | null;
  afternoon_in: string | null;
  afternoon_out: string | null;
}

export interface DTRMonth {
  month: string;
  month_label: string;
  records: DTRDayRecord[];
}
