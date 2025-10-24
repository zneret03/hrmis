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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Controller, useForm } from 'react-hook-form';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { CertificatesRequestForm } from '@/lib/types/certificates';
import { useShallow } from 'zustand/shallow';
import { requestDocument } from '@/services/certificates/certificates.service';
import { certificateType } from '../helpers/constants';

interface RequestDocumentDialog {
  userId: string;
}

export function RequestDocumentDialog({
  userId,
}: RequestDocumentDialog): JSX.Element {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const { open, type, toggleDialog } = useCertificates(
    useShallow((state) => ({
      toggleDialog: state.toggleOpenDialog,
      open: state.open,
      type: state.type,
    })),
  );

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<CertificatesRequestForm>();

  const resetVariables = (): void => {
    toggleDialog?.(false, null, null, null);
    reset({
      title: '',
      certificate_type: '',
      reason: '',
    });
    router.refresh();
  };

  const onSubmit = async (data: CertificatesRequestForm): Promise<void> => {
    startTransition(async () => {
      await requestDocument({ ...data, user_id: userId });
      resetVariables();
    });
  };

  const isOpenDialog = open && type === 'add';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleDialog?.(false, null, null, null)}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Request Document</DialogTitle>
        </DialogHeader>

        <Input
          type="text"
          title="Title"
          hasError={!!errors.title}
          errorMessage={errors.title?.message}
          {...register('title', {
            required: 'Required field',
          })}
        />

        <div className="space-y-2">
          <Label className="mb-1.5 text-sm font-medium">
            Request Document*
          </Label>
          <Controller
            name="certificate_type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value as string}
                onValueChange={(e) => onChange(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select document" />
                </SelectTrigger>
                <SelectContent>
                  {certificateType.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {!!errors.certificate_type && (
            <h1 className="text-sm text-red-500">
              {errors.certificate_type.message}
            </h1>
          )}
        </div>

        <Textarea
          title="reason"
          hasError={!!errors.reason}
          errorMessage={errors.reason?.message}
          {...register('reason', {
            required: 'Required field',
          })}
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
              <PlusIcon />
              Request Document
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
