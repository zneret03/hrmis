import { JSX } from 'react';
import { getLeaveCategories } from '@/services/leave_categories/leave-categories.services';
import { LeaveFileEditor } from './components/LeaveFileEditor';

export default async function FileLeave(): Promise<JSX.Element> {
  const categoryResponse = await getLeaveCategories(
    `?&search=&sortBy=created_at`,
  );

  return (
    <LeaveFileEditor category={categoryResponse?.leave_categories ?? []} />
  );
}
