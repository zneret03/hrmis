// Manually typed (the Supabase client is untyped). Matches the service_record
// migration. `users` is the embedded owner info for admin list views.
export interface ServiceRecord {
  id: string;
  user_id: string;
  position: string | null;
  status: string | null;
  salary: string | null;
  station: string | null;
  from_date: string | null;
  to_date: string | null;
  remarks: string | null;
  created_at: string | null;
  updated_at: string | null;
  archived_at: string | null;
}

export interface ServiceRecordWithUser extends ServiceRecord {
  users?: {
    first_name: string | null;
    last_name: string | null;
    employee_id: string | null;
  } | null;
}
