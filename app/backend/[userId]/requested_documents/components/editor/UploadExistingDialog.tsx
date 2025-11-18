'use client';

import { JSX, useEffect, useRef, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useRouter, usePathname } from 'next/navigation';
import {
  uploadTemplate,
  updateTemplate,
} from '@/services/template/template.service';
import { Plus, UploadCloud, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useShallow } from 'zustand/shallow';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { useTemplateDialog } from '@/services/template/state/template-state';
import { removeLastSegment } from '@/helpers/removeLastSegmentPath';

export function UploadExistingDialog(): JSX.Element {
  const uploadPdfRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<{ name: string }>();

  const name = watch('name');

  const { open, type, toggleOpen } = useCertificates(
    useShallow((state) => ({
      open: state.open,
      toggleOpen: state.toggleOpenDialog,
      type: state.type,
      data: state.data,
    })),
  );

  const { data: templateData } = useTemplateDialog(
    useShallow((state) => ({ data: state.data })),
  );

  const removeUploadedFile = (): void => {
    setPdfFile(null);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const onHandleUpload = (): void => {
    uploadPdfRef.current?.click();
  };

  const resetVariable = (): void => {
    toggleOpen?.(false, null, null, null);
    router.refresh();
  };

  const onSubmit = async (data: { name: string }): Promise<void> => {
    const { name } = data;
    startTransition(async () => {
      resetVariable();

      if (isEdit) {
        await updateTemplate(
          templateData?.id as string,
          name,
          pdfFile as File,
          'pdf',
          templateData?.file as string,
        );

        router.push(removeLastSegment(pathname));
        return;
      }

      await uploadTemplate(name, pdfFile as File, 'pdf');
      router.push(pathname.split('/template_editor')[0]);
    });
  };

  useEffect(() => {
    if (templateData) {
      reset({
        name: templateData.name as string,
      });
    }
  }, [templateData, reset]);

  const isOpenDialog = open && type === 'upload-existing';

  const isEdit = templateData ? 'Update File' : 'Save File';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null, null)}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Upload new Template</DialogTitle>
        </DialogHeader>

        <Input
          title="Name"
          {...register('name', {
            required: 'Required field.',
          })}
          hasError={!!errors.name}
          errorMessage={errors.name?.message}
        />

        <div className="space-x-2">
          <div
            className="flex h-[20rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-500"
            onClick={() => onHandleUpload()}
          >
            <UploadCloud className="h-15 w-15" />
            <span className="text-2xl">Upload Template</span>
          </div>
          <input
            ref={uploadPdfRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => onFileChange(e)}
            hidden
          />
        </div>

        {pdfFile && (
          <div className="bg-primary flex items-center justify-between rounded-lg px-4 py-2 text-white">
            {pdfFile?.name}
            <Trash className="cursor-pointer" onClick={removeUploadedFile} />
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <CustomButton
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending || !pdfFile || !name}
              isLoading={isPending}
            >
              <Plus /> {isEdit}
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
