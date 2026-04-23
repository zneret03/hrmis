import { Users } from './users';

export interface LeaveCardEntry {
  id: string;
  user_id: string;
  year: number;
  month: string;
  earned_vacation: number;
  earned_sick: number;
  enjoyed_vacation: number;
  enjoyed_sick: number;
  tardy_count: number;
  undertime_hours: number;
  undertime_minutes: number;
  undertime_days_equiv: number;
  total_spent_vacation: number;
  total_spent_sick: number;
  lwop_vacation: number;
  lwop_sick: number;
  balance_vacation: number;
  balance_sick: number;
  maternity_leave: number;
  remarks: string | null;
  encoded_by: string | null;
  leave_application_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  archived_at: string | null;
}

export interface LeaveCardEntryForm extends LeaveCardEntry {
  users: Pick<Users, 'id' | 'username' | 'email' | 'employee_id'>;
  encoded_by_user?: Pick<Users, 'id' | 'username' | 'email'> | null;
}

export type LeaveCardEntryInsert = Omit<
  LeaveCardEntry,
  'id' | 'created_at' | 'updated_at' | 'archived_at'
>;
