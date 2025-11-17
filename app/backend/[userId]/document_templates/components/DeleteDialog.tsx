'use client';

import { JSX, useTransition } from 'react';
import { useTemplateDialog } from '@/services/template/state/template-state';
import { DialogAlert } from '@/components/custom/DialogAlert';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { deleteTemplate } from '@/services/template/template.service';

export function DeleteTemplate(): JSX.Element {
  const [isPending, startTransition] = useTransition();

  const { open, type, toggleOpen, data } = useTemplateDialog(
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

  const onDeleteTemplate = async (): Promise<void> => {
    startTransition(async () => {
      await deleteTemplate(data?.id as string, data?.file as string);
      resetVariables();
    });
  };

  return (
    <DialogAlert
      open={open && type === 'delete'}
      title="Delete Template?"
      description="Do you want to delete this template?"
      callback={onDeleteTemplate}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type="error"
    />
  );
}
