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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useLeaveCardDialog } from '@/services/leave_card/states/leave-card-dialog';
import { useShallow } from 'zustand/shallow';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/services/auth/states/auth-state';
import {
  addLeaveCardEntry,
  updateLeaveCardEntry,
} from '@/services/leave_card/leave-card.services';
import { LeaveCardEntryInsert } from '@/lib/types/leave_card_entries';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - i);

type FormValues = Omit<
  LeaveCardEntryInsert,
  'user_id' | 'encoded_by' | 'leave_application_id'
>;

interface LeaveCardEntryDialogProps {
  targetUserId: string;
}

export function LeaveCardEntryDialog({
  targetUserId,
}: LeaveCardEntryDialogProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { id: encodedBy } = useAuth();

  const { open, type, data, toggleOpen } = useLeaveCardDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      year: currentYear,
      month: 'January',
      earned_vacation: 0,
      earned_sick: 0,
      enjoyed_vacation: 0,
      enjoyed_sick: 0,
      tardy_count: 0,
      undertime_hours: 0,
      undertime_minutes: 0,
      undertime_days_equiv: 0,
      total_spent_vacation: 0,
      total_spent_sick: 0,
      lwop_vacation: 0,
      lwop_sick: 0,
      balance_vacation: 0,
      balance_sick: 0,
      maternity_leave: 0,
      remarks: '',
    },
  });

  useEffect(() => {
    if (type === 'edit' && data) {
      reset({
        year: data.year ?? currentYear,
        month: data.month ?? 'January',
        earned_vacation: data.earned_vacation ?? 0,
        earned_sick: data.earned_sick ?? 0,
        enjoyed_vacation: data.enjoyed_vacation ?? 0,
        enjoyed_sick: data.enjoyed_sick ?? 0,
        tardy_count: data.tardy_count ?? 0,
        undertime_hours: data.undertime_hours ?? 0,
        undertime_minutes: data.undertime_minutes ?? 0,
        undertime_days_equiv: data.undertime_days_equiv ?? 0,
        total_spent_vacation: data.total_spent_vacation ?? 0,
        total_spent_sick: data.total_spent_sick ?? 0,
        lwop_vacation: data.lwop_vacation ?? 0,
        lwop_sick: data.lwop_sick ?? 0,
        balance_vacation: data.balance_vacation ?? 0,
        balance_sick: data.balance_sick ?? 0,
        maternity_leave: data.maternity_leave ?? 0,
        remarks: data.remarks ?? '',
      });
    } else if (type === 'add') {
      reset({
        year: currentYear,
        month: 'January',
        earned_vacation: 0,
        earned_sick: 0,
        enjoyed_vacation: 0,
        enjoyed_sick: 0,
        tardy_count: 0,
        undertime_hours: 0,
        undertime_minutes: 0,
        undertime_days_equiv: 0,
        total_spent_vacation: 0,
        total_spent_sick: 0,
        lwop_vacation: 0,
        lwop_sick: 0,
        balance_vacation: 0,
        balance_sick: 0,
        maternity_leave: 0,
        remarks: '',
      });
    }
  }, [type, data, reset]);

  const resetVariables = () => {
    toggleOpen?.(false, null, null);
    router.refresh();
    reset();
  };

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const payload: LeaveCardEntryInsert = {
        ...values,
        tardy_count: Math.trunc(values.tardy_count),
        user_id: targetUserId,
        encoded_by: encodedBy ?? null,
        leave_application_id: null,
      };

      if (type === 'add') {
        await addLeaveCardEntry(payload);
      } else if (type === 'edit' && data?.id) {
        await updateLeaveCardEntry(data.id, payload);
      }

      resetVariables();
    });
  };

  const isOpen = open && (type === 'add' || type === 'edit');
  const title =
    type === 'add' ? 'Add Leave Card Entry' : 'Edit Leave Card Entry';

  const numericField = (
    label: string,
    name: keyof FormValues,
    step = 'any',
  ) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        step={step}
        min={0}
        className="h-8 text-sm"
        {...register(name, { valueAsNumber: true })}
      />
      {errors[name] && (
        <p className="text-destructive text-xs">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => toggleOpen?.(false, null, null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[56rem]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Period */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Year *</Label>
              <Controller
                name="year"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Month *</Label>
              <Controller
                name="month"
                control={control}
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* No. of Days Leave Earned */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              No. of Days Leave Earned
            </p>
            <div className="grid grid-cols-2 gap-4">
              {numericField('Vacation', 'earned_vacation')}
              {numericField('Sick', 'earned_sick')}
            </div>
          </div>

          {/* Leave Enjoyed */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Leave Enjoyed
            </p>
            <div className="grid grid-cols-2 gap-4">
              {numericField('Vacation', 'enjoyed_vacation')}
              {numericField('Sick', 'enjoyed_sick')}
            </div>
          </div>

          {/* Tardy */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Tardiness
            </p>
            {numericField('No. Tardy for 5 mins. or more', 'tardy_count', '1')}
          </div>

          {/* Undertime */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Undertime
            </p>
            <div className="grid grid-cols-3 gap-4">
              {numericField('Hours', 'undertime_hours')}
              {numericField('Minutes', 'undertime_minutes')}
              {numericField('Equiv. in Days', 'undertime_days_equiv')}
            </div>
          </div>

          {/* Total Leave Spent */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Total Leave Spent
            </p>
            <div className="grid grid-cols-2 gap-4">
              {numericField('Vacation', 'total_spent_vacation')}
              {numericField('Sick', 'total_spent_sick')}
            </div>
          </div>

          {/* Leave Without Pay */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Leave Without Pay
            </p>
            <div className="grid grid-cols-2 gap-4">
              {numericField('Vacation', 'lwop_vacation')}
              {numericField('Sick', 'lwop_sick')}
            </div>
          </div>

          {/* Balance */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Balance
            </p>
            <div className="grid grid-cols-2 gap-4">
              {numericField('Vacation', 'balance_vacation')}
              {numericField('Sick', 'balance_sick')}
            </div>
          </div>

          {/* Maternity Leave */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Maternity Leave
            </p>
            {numericField('Days', 'maternity_leave')}
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <Label className="text-xs">Remarks</Label>
            <Textarea
              placeholder="Optional remarks..."
              className="resize-none"
              rows={2}
              {...register('remarks')}
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
            {type === 'add' ? 'Save Entry' : 'Update Entry'}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
