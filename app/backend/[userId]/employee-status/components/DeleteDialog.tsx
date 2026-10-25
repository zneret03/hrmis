'use client';

import { JSX, useTransition } from 'react';
import { useEmployeeStatusDialog } from '@/services/employee_status/states/employee-status-dialog';
import { DialogAlert } from '@/components/custom/DialogAlert';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { deleteEmployeeStatus } from '@/services/employee_status/employee-status.services';

export function DeleteEmployeeStatusDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { open, type, toggleOpen, data } = useEmployeeStatusDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );
  const router = useRouter();

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null);
    router.refresh();
  };

  const onDeleteStatus = async (): Promise<void> => {
    startTransition(async () => {
      await deleteEmployeeStatus(data?.id as string);
      resetVariables();
    });
  };

  return (
    <DialogAlert
      open={open && type === 'delete'}
      title="Delete Employee Status?"
      description="Do you want to delete this employee status?"
      callback={onDeleteStatus}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type="error"
    />
  );
}
