'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaneIcon } from 'lucide-react';
import { format } from 'date-fns';
import { LeaveApplicationsForm } from '@/lib/types/leave_application';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog';
import { useShallow } from 'zustand/shallow';
import { cardStatus } from '../helpers/constants';

export function LeaveCard(args: LeaveApplicationsForm): JSX.Element {
  const {
    leave_categories,
    start_date,
    end_date,
    remarks,
    status,
    hr_comment,
  } = args;

  const { toggleOpen } = useLeaveApplicationDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  return (
    <Card className={`${cardStatus[status]} text-white`}>
      <CardContent className="space-y-2 py-0">
        <CardTitle className="flex items-center justify-between">
          <section className="flex items-center gap-2">
            <PlaneIcon className="h-5 w-5" />
            {leave_categories.name}
          </section>

          <Badge variant="outline" className="text-white capitalize">
            {status}
          </Badge>
        </CardTitle>

        {remarks && <p className="text-sm opacity-90">{remarks}</p>}

        <div className="text-sm">
          <span>{format(start_date as string, 'MMMM dd, yyyy')}</span> -{' '}
          <span>{format(end_date as string, 'MMMM dd, yyyy')}</span>
        </div>

        {hr_comment && (
          <div className="rounded border border-white/30 bg-white/10 px-2 py-1 text-xs">
            <span className="font-semibold">HR Comment: </span>
            {hr_comment}
          </div>
        )}

        {!['cancelled', 'disapproved', 'approved'].includes(status) && (
          <div className="mt-4 text-right">
            <Button
              className="cursor-pointer bg-transparent underline shadow-none hover:bg-transparent"
              onClick={() => toggleOpen?.(true, 'cancel', { ...args })}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
