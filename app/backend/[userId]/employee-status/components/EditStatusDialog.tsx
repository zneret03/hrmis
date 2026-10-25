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
import { useEmployeeStatusDialog } from '@/services/employee_status/states/employee-status-dialog';
import { editEmployeeStatus } from '@/services/employee_status/employee-status.services';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { EmployeeStatus } from '@/lib/types/employee_status';
import { isEqual } from 'lodash';
import { toast } from 'sonner';

type EmployeeStatusForm = Pick<EmployeeStatus, 'name' | 'id'>;

export function EditEmployeeStatusDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeStatusForm>();

  const router = useRouter();

  const { open, toggleOpen, type, data } = useEmployeeStatusDialog(
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

  const onSubmit = async (statusData: EmployeeStatusForm): Promise<void> => {
    const { name } = statusData;
    startTransition(async () => {
      if (isEqual(name, data?.name)) {
        toast.info('Info', {
          description: 'No changes in data.',
        });

        toggleOpen?.(false, null, null);
        return;
      }

      await editEmployeeStatus({
        name: name as string,
        id: data?.id as string,
      });
      resetVariables();
    });
  };

  useEffect(() => {
    if (!!data) {
      reset({
        name: data.name,
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
          <DialogTitle>Edit Employee Status</DialogTitle>
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
              Save
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
