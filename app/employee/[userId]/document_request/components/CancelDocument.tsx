'use client';

import { JSX, useTransition } from 'react';
import { DialogAlert } from '@/components/custom/DialogAlert';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { updateDocument } from '@/services/certificates/certificates.service';

export function CancelDocumentDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { open, type, toggleOpen, data } = useCertificates(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const router = useRouter();

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null, null);
    router.refresh();
  };

  const onCancelDocument = async (): Promise<void> => {
    startTransition(async () => {
      updateDocument({ certificate_status: 'cancelled' }, data?.id as string);
      resetVariables();
    });
  };

  return (
    <DialogAlert
      open={open && type === 'cancel'}
      title={`Cancel document request?`}
      description="Do you want to cancel this request?"
      callback={onCancelDocument}
      cancel={() => toggleOpen?.(false, null, null, null)}
      isLoading={isPending}
      type="error"
    />
  );
}
