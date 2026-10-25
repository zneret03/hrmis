'use client';

import { JSX, useTransition } from 'react';
import { useServiceRecordDialog } from '@/services/service_record/states/service-record-dialog';
import { DialogAlert } from '@/components/custom/DialogAlert';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { deleteServiceRecord } from '@/services/service_record/service-record.services';

export function DeleteServiceRecordDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { open, type, toggleOpen, data } = useServiceRecordDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );
  const router = useRouter();

  const onDelete = async (): Promise<void> => {
    startTransition(async () => {
      await deleteServiceRecord(data?.id as string);
      toggleOpen?.(false, null, null);
      router.refresh();
    });
  };

  return (
    <DialogAlert
      open={open && type === 'delete'}
      title="Delete Service Record?"
      description="Do you want to delete this service record entry?"
      callback={onDelete}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type="error"
    />
  );
}
