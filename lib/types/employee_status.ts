// Manually typed: the Supabase client in this project is untyped, so a generated
// db-types entry is not required. Shape matches the employee_status migration.
export interface EmployeeStatus {
  id: string;
  name: string;
  created_at: string;
  updated_at: string | null;
  archived_at: string | null;
}
