'use client';

import { JSX, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { Control, Controller, useForm } from 'react-hook-form';
import { useAuth } from '@/services/auth/states/auth-state';
import { CalendarPicker } from '@/components/custom/CalendarPicker';
import { LeaveApplicationsFormData } from '@/lib/types/leave_application';
import { LeaveCategories } from '@/lib/types/leave_categories';
import { addLeaveRequest } from '@/services/leave_applications/leave-applications.services';
import { DateRange } from 'react-day-picker';
import { creditsCount } from '@/helpers/convertFromAndToDate';
import { useRouter } from 'next/navigation';
import { axiosService } from '@/app/api/axios-client';

interface FileLeaveDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  category: Pick<LeaveCategories, 'name' | 'id'>[];
  pdfBlob: Blob | null;
}

export function FileLeaveDetailsDialog({
  open,
  onClose,
  category,
  pdfBlob,
}: FileLeaveDetailsDialogProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { id: userId, username } = useAuth();
  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
    reset,
  } = useForm<LeaveApplicationsFormData>({
    defaultValues: {
      leave_id: '',
      remarks: '',
      dateRange: undefined,
    },
  });

  const dateRange = watch('dateRange');

  const handleClose = (): void => {
    reset();
    onClose();
  };

  const uploadDocument = async (): Promise<string | null> => {
    if (!pdfBlob) return null;
    const formData = new FormData();
    formData.append(
      'file',
      pdfBlob,
      `${username ?? userId}-leave-form.pdf`,
    );
    formData.append('username', username ?? userId);
    const response = await axiosService.post(
      '/api/protected/leave_application/document',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data.data.url as string;
  };

  const onSubmit = (data: LeaveApplicationsFormData): void => {
    startTransition(async () => {
      const { leave_id, remarks } = data;
      const startDate = data.dateRange?.from;
      const endDate = data.dateRange?.to;

      const credsCount = creditsCount(
        new Date(startDate as Date),
        new Date(endDate as Date),
      );

      const documentUrl = await uploadDocument();

      const newData = {
        leave_id,
        user_id: userId,
        status: 'pending',
        remarks,
        start_date: new Date(startDate as Date).toISOString(),
        end_date: new Date(endDate as Date).toISOString(),
        document: documentUrl,
      };

      await addLeaveRequest(newData, credsCount);
      handleClose();
      router.back();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Leave Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-1 pb-2">
          <div className="space-y-2">
            <Label className="mb-1.5 text-sm font-medium">Leave Status*</Label>
            <Controller
              name="leave_id"
              control={control}
              rules={{ required: 'Required field.' }}
              render={({ field: { onChange, value } }) => (
                <Select value={value as string} onValueChange={onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Leave Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {category.map((item, index) => (
                      <SelectItem key={`${item.id}-${index}`} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {!!errors.leave_id && (
              <p className="text-sm text-red-500">{errors.leave_id.message}</p>
            )}
          </div>

          <CalendarPicker
            title="Start and End Date"
            name="dateRange"
            control={
              control as Control<LeaveApplicationsFormData | { date: Date }>
            }
            date={dateRange as DateRange}
            mode="range"
          />

          <Textarea
            title="Description"
            className="h-[10rem]"
            placeholder="Leave Description"
            hasError={!!errors.remarks}
            errorMessage={errors.remarks?.message}
            {...register('remarks', {
              required: 'Required field.',
            })}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <CustomButton
            type="button"
            isLoading={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            <Plus /> File Leave
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
