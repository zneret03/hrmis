'use client';

import { JSX, useTransition } from 'react';
import { useLoyaltyThresholdDialog } from '@/services/loyalty_threshold/states/loyalty-threshold-dialog';
import { DialogAlert } from '@/components/custom/DialogAlert';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { deleteLoyaltyThreshold } from '@/services/loyalty_threshold/loyalty-threshold.services';

export function DeleteLoyaltyThresholdDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { open, type, toggleOpen, data } = useLoyaltyThresholdDialog(
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

  const onDeleteThreshold = async (): Promise<void> => {
    startTransition(async () => {
      await deleteLoyaltyThreshold(data?.id as string);
      resetVariables();
    });
  };

  return (
    <DialogAlert
      open={open && type === 'delete'}
      title="Delete Loyalty Threshold?"
      description="Do you want to delete this loyalty threshold?"
      callback={onDeleteThreshold}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type="error"
    />
  );
}
