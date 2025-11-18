'use client';

import { JSX, useTransition, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useTemplateDialog } from '@/services/template/state/template-state';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';
import { useRouter, usePathname } from 'next/navigation';
import { updateTemplate } from '@/services/template/template.service';
import { removeLastSegment } from '@/helpers/removeLastSegmentPath';

export function EditTemplateDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string }>();

  const router = useRouter();
  const pathname = usePathname();

  const today = new Date();

  const {
    open,
    toggleOpen,
    type,
    data: templateData,
  } = useTemplateDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog,
      data: state.data,
    })),
  );

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null);
    router.push(removeLastSegment(pathname));
    router.refresh();
  };

  const onSubmit = async (data: { name: string }): Promise<void> => {
    const { name } = data;

    const file = new File(
      [templateData?.blob as Blob],
      `document-${today.getTime()}.docx`,
    );

    startTransition(async () => {
      await updateTemplate(
        templateData?.id as string,
        name,
        file,
        templateData?.type as string,
        templateData?.file as string,
      );

      resetVariables();
    });
  };

  useEffect(() => {
    if (templateData) {
      reset({
        name: templateData?.name as string,
      });
    }
  }, [templateData, reset]);

  const isOpenDialog = open && type === 'edit';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Edit Template Document</DialogTitle>
        </DialogHeader>

        <Input
          title="Name"
          {...register('name', {
            required: 'Required field.',
          })}
          hasError={!!errors.name}
          errorMessage={errors.name?.message}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleOpen?.(false, null, templateData)}
          >
            Cancel
          </Button>

          <DialogClose asChild>
            <CustomButton
              type="button"
              isLoading={isPending}
              onClick={handleSubmit(onSubmit)}
            >
              <Pencil /> Update Template
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
