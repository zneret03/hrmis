'use client';

import { JSX, useEffect, useTransition } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useServiceRecordDialog } from '@/services/service_record/states/service-record-dialog';
import {
  addServiceRecord,
  editServiceRecord,
  type ServiceRecordForm,
} from '@/services/service_record/service-record.services';

interface ServiceRecordFormDialogProps {
  users: { id: string; employee_id: string | null; email: string }[];
}

export function ServiceRecordFormDialog({
  users,
}: ServiceRecordFormDialogProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceRecordForm>();

  const { open, type, data, toggleOpen } = useServiceRecordDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const isEdit = type === 'edit';
  const isOpenDialog = open && (type === 'add' || type === 'edit');

  useEffect(() => {
    if (isOpenDialog) {
      reset({
        user_id: data?.user_id ?? '',
        position: data?.position ?? '',
        status: data?.status ?? '',
        salary: data?.salary ?? '',
        station: data?.station ?? '',
        from_date: data?.from_date ?? '',
        to_date: data?.to_date ?? '',
        remarks: data?.remarks ?? '',
      });
    }
  }, [isOpenDialog, data, reset]);

  const onSubmit = async (form: ServiceRecordForm): Promise<void> => {
    startTransition(async () => {
      if (isEdit) {
        await editServiceRecord({ ...form, id: data?.id });
      } else {
        await addServiceRecord(form);
      }
      toggleOpen?.(false, null, null);
      router.refresh();
    });
  };

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="sm:max-w-[42rem]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Service Record</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {!isEdit && (
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm font-medium">Employee*</Label>
              <Controller
                control={control}
                name="user_id"
                rules={{ required: 'Please select an employee.' }}
                render={({ field: { onChange, value } }) => (
                  <Select value={value as string} onValueChange={onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.employee_id
                            ? `${user.employee_id} — ${user.email}`
                            : user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.user_id && (
                <span className="text-sm text-red-500">
                  {errors.user_id.message as string}
                </span>
              )}
            </div>
          )}

          <Input
            title="Position"
            {...register('position', { required: 'Required field.' })}
            hasError={!!errors.position}
            errorMessage={errors.position?.message as string}
          />
          <Input
            title="Status of Appointment"
            isOptional
            {...register('status')}
          />
          <Input title="Salary" isOptional {...register('salary')} />
          <Input title="Station / Office" isOptional {...register('station')} />
          <Input
            title="From"
            type="date"
            isOptional
            {...register('from_date')}
          />
          <Input title="To" type="date" isOptional {...register('to_date')} />

          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm font-medium">Remarks</Label>
            <Textarea
              {...register('remarks')}
              placeholder="Remarks (optional)"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <CustomButton
            type="button"
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? 'Save' : 'Create'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
