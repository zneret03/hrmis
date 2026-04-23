'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog';
import { useShallow } from 'zustand/shallow';

export function LeavePageHeader(): JSX.Element {
  const { toggleOpen } = useLeaveApplicationDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        File a leave request and track its status below.
      </p>
      <Button onClick={() => toggleOpen?.(true, 'add', null)}>
        <Plus className="mr-2 h-4 w-4" />
        File a Leave
      </Button>
    </div>
  );
}
