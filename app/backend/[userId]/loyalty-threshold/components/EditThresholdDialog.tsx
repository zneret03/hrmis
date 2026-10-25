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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useLoyaltyThresholdDialog } from '@/services/loyalty_threshold/states/loyalty-threshold-dialog';
import { editLoyaltyThreshold } from '@/services/loyalty_threshold/loyalty-threshold.services';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { isEqual } from 'lodash';
import { toast } from 'sonner';

type LoyaltyThresholdForm = { year_threshold: number };

export function EditLoyaltyThresholdDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoyaltyThresholdForm>();

  const router = useRouter();

  const { open, toggleOpen, type, data } = useLoyaltyThresholdDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null);
    router.refresh();
  };

  const onSubmit = async (
    thresholdData: LoyaltyThresholdForm,
  ): Promise<void> => {
    const { year_threshold } = thresholdData;
    startTransition(async () => {
      if (isEqual(Number(year_threshold), data?.year_threshold)) {
        toast.info('Info', {
          description: 'No changes in data.',
        });

        toggleOpen?.(false, null, null);
        return;
      }

      await editLoyaltyThreshold({
        year_threshold: Number(year_threshold),
        id: data?.id as string,
      });
      resetVariables();
    });
  };

  useEffect(() => {
    if (!!data) {
      reset({
        year_threshold: data.year_threshold ?? undefined,
      });
    }
  }, [data, reset]);

  const isOpenDialog = open && type === 'edit';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Edit Loyalty Threshold</DialogTitle>
        </DialogHeader>

        <Input
          title="Years of Service"
          type="number"
          {...register('year_threshold', {
            required: 'Required field.',
            valueAsNumber: true,
            min: { value: 1, message: 'Must be at least 1 year.' },
          })}
          hasError={!!errors.year_threshold}
          errorMessage={errors.year_threshold?.message}
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
              Save
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
