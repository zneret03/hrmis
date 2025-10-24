import { Database } from './db-types';
import { Users } from './users';

export type YearThreshold = {
  id: string;
  year_threshold: number;
};

export type Awards = Database['public']['Tables']['awards']['Row'] & {
  users: Users;
  yearThreshold?: YearThreshold;
};
