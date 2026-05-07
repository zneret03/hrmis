'use client';

import { JSX, useState, useCallback, useTransition } from 'react';
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
import { Document, Page, pdfjs } from 'react-pdf';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog';
import { useShallow } from 'zustand/react/shallow';
import { useRouter } from 'next/navigation';
import { Control, Controller, useForm } from 'react-hook-form';
import { useAuth } from '@/services/auth/states/auth-state';
import { CalendarPicker } from '@/components/custom/CalendarPicker';
import { LeaveApplicationsFormData } from '@/lib/types/leave_application';
import { LeaveCategories } from '@/lib/types/leave_categories';
import { addLeaveRequest } from '@/services/leave_applications/leave-applications.services';
import { DateRange } from 'react-day-picker';
import { creditsCount } from '@/helpers/convertFromAndToDate';
import {
  headerFields,
  leaveTypeFields,
  leaveDetailsFields,
  workingDaysFields,
  commutationFields,
  leaveCertificationFields,
  recommendationFields,
  approvedForFields,
  disapprovedDueToFields,
  PDF_A4_WIDTH,
  PDF_A4_HEIGHT,
  type LeaveFormField,
} from '@/app/helpers/leave-application/leave-form-fields';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface FileLeaveDialog {
  category: Pick<LeaveCategories, 'name' | 'id'>[];
}

export function FileLeaveDialog({ category }: FileLeaveDialog): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [scale, setScale] = useState(1.0);
  const [pdfFormData, setPdfFormData] = useState<
    Record<string, string | boolean>
  >({});

  const state = useAuth();
  const router = useRouter();

  const categoryData = category.map((item) => ({
    id: item.id,
    name: item.name,
  }));

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

  const { open, toggleOpen, type } = useLeaveApplicationDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const pageWrapperRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const updateScale = () => {
        setScale(node.getBoundingClientRect().width / PDF_A4_WIDTH);
      };
      const resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(node);
      updateScale();
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handlePdfFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const fieldValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setPdfFormData((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null);
    router.refresh();
    reset();
    setPdfFormData({});
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

      const newData = {
        leave_id,
        user_id: state.id,
        status: 'pending',
        remarks,
        start_date: new Date(startDate as Date).toISOString(),
        end_date: new Date(endDate as Date).toISOString(),
        document: null,
      };

      await addLeaveRequest(newData, credsCount);
      resetVariables();
    });
  };

  const renderFields = (fields: LeaveFormField[]) =>
    fields.map((field) => {
      const top = (PDF_A4_HEIGHT - field.y) * scale;
      const left = field.x * scale;
      const width = field.width * scale;
      const height = field.height * scale;

      const commonStyle: React.CSSProperties = {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 10,
        border: 'none',
        outline: '1px solid rgba(0, 150, 255, 0.5)',
        backgroundColor: 'rgba(0, 150, 255, 0.1)',
        boxSizing: 'border-box',
      };

      if (field.type === 'checkbox') {
        return (
          <input
            key={field.name}
            type="checkbox"
            name={field.name}
            checked={(pdfFormData[field.name] as boolean) || false}
            onChange={handlePdfFieldChange}
            style={commonStyle}
          />
        );
      }

      if (field.type === 'textarea') {
        return (
          <textarea
            key={field.name}
            name={field.name}
            value={(pdfFormData[field.name] as string) || ''}
            onChange={handlePdfFieldChange}
            style={{
              ...commonStyle,
              fontSize: `${height * field.fontSize}px`,
              resize: 'none',
              padding: `${2 * scale}px`,
            }}
          />
        );
      }

      return (
        <input
          key={field.name}
          type="text"
          name={field.name}
          value={(pdfFormData[field.name] as string) || ''}
          onChange={handlePdfFieldChange}
          style={{
            ...commonStyle,
            fontSize: `${height * field.fontSize}px`,
          }}
        />
      );
    });

  const isOpenDialog = open && type === 'add';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="overflow-auto sm:max-h-[20rem] sm:max-w-[80rem] md:max-h-[30rem] lg:max-h-[40rem] xl:max-h-[45rem]">
        <DialogHeader>
          <DialogTitle>Application for Leave</DialogTitle>
        </DialogHeader>

        <div className="mx-auto w-full max-w-4xl p-4">
          <Document file="/documents/Application Leave Form.pdf">
            <div ref={pageWrapperRef} className="relative shadow-lg">
              <Page
                pageNumber={1}
                width={PDF_A4_WIDTH * scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />

              {renderFields(headerFields)}
              {renderFields(leaveTypeFields)}
              {renderFields(leaveDetailsFields)}
              {renderFields(workingDaysFields)}
              {renderFields(commutationFields)}
              {renderFields(leaveCertificationFields)}
              {renderFields(recommendationFields)}
              {renderFields(approvedForFields)}
              {renderFields(disapprovedDueToFields)}
            </div>
          </Document>
        </div>

        <div className="space-y-4 px-4 pb-2">
          <div className="space-y-2">
            <Label className="mb-1.5 text-sm font-medium">Leave Status*</Label>
            <Controller
              name="leave_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value as string}
                  onValueChange={(e) => onChange(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Leave Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryData.map((item, index) => (
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
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={resetVariables}>
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <CustomButton
              type="button"
              isLoading={isPending}
              onClick={handleSubmit(onSubmit)}
            >
              <Plus /> File leave
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
