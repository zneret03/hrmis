'use client';

import { JSX, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useTemplateDialog } from '@/services/template/state/template-state';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';
import { useRouter, usePathname } from 'next/navigation';
import { uploadTemplate } from '@/services/template/template.service';

export function AddTemplateDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    router.push(pathname.split('/template_editor')[0]);
    router.refresh();
  };

  const onSubmit = async (data: { name: string }): Promise<void> => {
    const { name } = data;

    const file = new File(
      [templateData?.blob as Blob],
      `document-${today.getTime()}.docx`,
    );

    startTransition(async () => {
      await uploadTemplate(name, file, templateData?.type as string);
      resetVariables();
    });
  };

  const isOpenDialog = open && type === 'add';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Add Template Document</DialogTitle>
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
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <CustomButton
              type="button"
              isLoading={isPending}
              onClick={handleSubmit(onSubmit)}
            >
              <Plus /> Add Template
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
