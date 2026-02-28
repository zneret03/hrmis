import { Database } from './db-types';

export type Users = Database['public']['Tables']['users']['Row'];
export type UpdateUser = Database['public']['Tables']['users']['Update'];
export type InsertUser = Database['public']['Tables']['users']['Insert'];

export type UserForm = Omit<
  Users,
  'created_at' | 'updated_at' | 'archived_at' | 'avatar'
> & {
  password?: string;
};

export interface SignIn extends Pick<UserForm, 'username'> {
  password: string;
}
