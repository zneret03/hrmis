'use client';

import { JSX, useTransition } from 'react';
import { DialogAlert } from '@/components/custom/DialogAlert';
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog';
import { useShallow } from 'zustand/shallow';
import { useRouter } from 'next/navigation';
import { approveDisapprovestatus } from '@/services/leave_applications/leave-applications.services';

export function CancelLeaveDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { open, type, data, toggleOpen } = useLeaveApplicationDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const resetVariables = () => {
    toggleOpen?.(false, null, null);
    router.refresh();
  };

  const onCancel = () => {
    startTransition(async () => {
      await approveDisapprovestatus(
        'cancelled',
        data?.users?.id as string,
        data?.id as string,
        0,
      );
      resetVariables();
    });
  };

  return (
    <DialogAlert
      open={open && type === 'cancel'}
      title="Cancel leave request?"
      description="This will cancel your pending leave request. You can file a new one at any time."
      callback={onCancel}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type="error"
    />
  );
}
