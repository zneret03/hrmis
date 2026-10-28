import { Users } from '@/lib/types/users';

type NamedUser = Partial<Pick<Users, 'first_name' | 'last_name' | 'username'>>;

/**
 * "Last, First" display name; falls back to the username when no name is on
 * file, and to null when there is nothing to show.
 */
export const employeeName = (
  user: NamedUser | null | undefined,
): string | null =>
  [user?.last_name, user?.first_name].filter(Boolean).join(', ') ||
  user?.username ||
  null;
