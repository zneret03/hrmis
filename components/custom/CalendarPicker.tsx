'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Control, Controller } from 'react-hook-form';
import { LeaveApplicationsFormData } from '@/lib/types/leave_application';
import { DateRange } from 'react-day-picker';

interface CalendarPicker {
  title: string;
  name: keyof LeaveApplicationsFormData;
  control: Control<LeaveApplicationsFormData | { date: Date }>;
  date: DateRange | Date;
  mode: 'single' | 'range';
  isDisabled?: boolean;
}

export function CalendarPicker({
  title,
  name,
  control,
  date,
  mode = 'single',
  isDisabled = true,
}: CalendarPicker): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  const newDate = date as DateRange;
  const placeholder =
    mode === 'range'
      ? `${new Date(newDate?.from as Date).toLocaleDateString()} - ${new Date(newDate?.to as Date).toLocaleDateString()}`
      : new Date(date as Date).toString();

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {title}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {date ? placeholder : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-[1000] w-full overflow-hidden p-0"
          align="start"
        >
          <Controller
            name={name as keyof LeaveApplicationsFormData}
            control={control}
            render={({ field: { onChange, value } }) => {
              const values =
                mode === 'range' ? (value as DateRange) : (value as undefined);

              return (
                <Calendar
                  mode="range"
                  selected={values}
                  captionLayout="dropdown"
                  timeZone="UTC"
                  disabled={
                    isDisabled
                      ? [{ before: new Date() }, { dayOfWeek: [0, 6] }]
                      : false
                  }
                  onSelect={(date) => {
                    onChange(date);

                    if (mode === 'range') {
                      if (date?.to !== date?.from) {
                        setOpen(false);
                      }
                    }
                  }}
                />
              );
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
