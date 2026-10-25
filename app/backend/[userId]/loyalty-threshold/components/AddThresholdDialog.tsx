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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useLoyaltyThresholdDialog } from '@/services/loyalty_threshold/states/loyalty-threshold-dialog';
import { addLoyaltyThreshold } from '@/services/loyalty_threshold/loyalty-threshold.services';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type LoyaltyThresholdForm = { year_threshold: number };

export function AddLoyaltyThresholdDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoyaltyThresholdForm>();

  const router = useRouter();

  const { open, toggleOpen, type } = useLoyaltyThresholdDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null);
    router.refresh();
  };

  const onSubmit = async (data: LoyaltyThresholdForm): Promise<void> => {
    const { year_threshold } = data;
    startTransition(async () => {
      await addLoyaltyThreshold(Number(year_threshold));
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
          <DialogTitle>Add Loyalty Threshold</DialogTitle>
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
              Create
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
