'use client';

import { JSX, useTransition } from 'react';
import { DialogAlert } from '@/components/custom/DialogAlert';
import { useLeaveCardDialog } from '@/services/leave_card/states/leave-card-dialog';
import { useShallow } from 'zustand/shallow';
import { useRouter } from 'next/navigation';
import { deleteLeaveCardEntry } from '@/services/leave_card/leave-card.services';

export function DeleteLeaveCardEntryDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { open, type, data, toggleOpen } = useLeaveCardDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const onDelete = () => {
    startTransition(async () => {
      await deleteLeaveCardEntry(data?.id as string);
      toggleOpen?.(false, null, null);
      router.refresh();
    });
  };

  return (
    <DialogAlert
      open={open && type === 'delete'}
      title="Delete leave card entry?"
      description="This entry will be removed from the leave card. This action cannot be undone."
      callback={onDelete}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type="error"
    />
  );
}
