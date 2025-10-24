'use client';

import { JSX, useTransition, useEffect, useState } from 'react';
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
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Awards } from '@/lib/types/awards';
import { useAwards } from '@/services/awards/state/use-awards';
import { awardsType } from '../helpers/constants';
import { Users } from '@/lib/types/users';
import { updateAward } from '@/services/awards/awards.service';

type AwardsForm = Partial<Awards> & {
  yearThreshold: number;
};

interface EditAwardDialog {
  users: Users[];
}

export function EditAward({ users }: EditAwardDialog): JSX.Element {
  const [isUpdateThreshold, setUpdateThreshold] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [isPendingThreshold, startThresholdTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<AwardsForm>();
  const today = new Date();

  const router = useRouter();

  const threshold = watch('yearThreshold');

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null);
    router.refresh();
    setUpdateThreshold(false);
  };

  const onUpdateThreshold = (): void => {
    setUpdateThreshold((prevState) => !prevState);
  };

  const onUpdateYearThreshold = (): void => {
    startThresholdTransition(async () => {
      await updateAward(
        { value: threshold },
        data?.yearThreshold?.id as string,
        'update-threshold',
      );

      resetVariables();
    });
  };

  const { open, toggleOpen, type, data } = useAwards(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog,
      data: state.data,
    })),
  );

  const onSubmit = async (awardData: AwardsForm): Promise<void> => {
    startTransition(async () => {
      await updateAward(
        { ...awardData, year: today.getFullYear() },
        data?.id as string,
      );
      resetVariables();
    });
  };

  useEffect(() => {
    if (!!data) {
      reset({
        title: data.title,
        award_type: data.award_type,
        user_id: data.users?.id,
        description: data.description,
        yearThreshold: Number(data.yearThreshold?.year_threshold) as number,
      });
    }
  }, [data, reset]);

  const isOpenDialog = open && type === 'edit';
  const thresholdText = isUpdateThreshold
    ? 'Save Threshold'
    : 'Update Threshold';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Edit Award</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            type="number"
            title="Year Threshold"
            disabled={!isUpdateThreshold}
            {...register('yearThreshold', {
              required: 'Required field',
            })}
          />

          <section className="text-right">
            <CustomButton
              disabled={isPendingThreshold}
              isLoading={isPendingThreshold}
              onClick={() =>
                isUpdateThreshold
                  ? onUpdateYearThreshold()
                  : onUpdateThreshold()
              }
            >
              {thresholdText}
            </CustomButton>
          </section>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            title="Title"
            {...register('title', {
              required: 'Required field.',
            })}
            hasError={!!errors.title}
            errorMessage={errors.title?.message}
          />

          <div className="space-y-2">
            <Label className="mb-1.5 text-sm font-medium">Awards*</Label>
            <Controller
              name="award_type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value as string}
                  onValueChange={(e) => onChange(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select awards" />
                  </SelectTrigger>
                  <SelectContent>
                    {awardsType.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {!!errors.award_type && (
              <h1 className="text-sm text-red-500">
                {errors.award_type.message}
              </h1>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="mb-1.5 text-sm font-medium">Select User*</Label>
          <Controller
            name="user_id"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value as string}
                onValueChange={(e) => onChange(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {!!errors.award_type && (
            <h1 className="text-sm text-red-500">
              {errors.award_type.message}
            </h1>
          )}
        </div>

        <Textarea
          title="Description"
          {...register('description', {
            required: 'Required field.',
          })}
          hasError={!!errors.description}
          errorMessage={errors.description?.message}
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
