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
import { useEmployeeStatusDialog } from '@/services/employee_status/states/employee-status-dialog';
import { addEmployeeStatus } from '@/services/employee_status/employee-status.services';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { EmployeeStatus } from '@/lib/types/employee_status';

type EmployeeStatusForm = Pick<EmployeeStatus, 'name'>;

export function AddEmployeeStatusDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeStatusForm>();

  const router = useRouter();

  const { open, toggleOpen, type } = useEmployeeStatusDialog(
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

  const onSubmit = async (data: EmployeeStatusForm): Promise<void> => {
    const { name } = data;
    startTransition(async () => {
      await addEmployeeStatus(name as string);
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
          <DialogTitle>Add Employee Status</DialogTitle>
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
              Create
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
