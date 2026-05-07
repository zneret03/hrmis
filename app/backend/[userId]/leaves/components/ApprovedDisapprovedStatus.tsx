'use client';

import { JSX, useTransition, useState } from 'react';
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import { approveDisapprovestatus } from '@/services/leave_applications/leave-applications.services';
import { convertFromAndToDate } from '@/helpers/convertFromAndToDate';
import { useAuth } from '@/services/auth/states/auth-state';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

export function ApproveDisapproveDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [hrComment, setHrComment] = useState('');
  const { id: reviewerId } = useAuth();

  const { open, type, toggleOpen, data } = useLeaveApplicationDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const router = useRouter();

  const countDates = convertFromAndToDate(
    data?.start_date as string,
    data?.end_date as string,
  );

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null);
    setHrComment('');
    router.refresh();
  };

  const isApprove = data?.status === 'approved';

  const onAction = async (): Promise<void> => {
    startTransition(async () => {
      await approveDisapprovestatus(
        isApprove ? 'disapproved' : 'approved',
        data?.users?.id as string,
        data?.id as string,
        countDates,
        reviewerId ?? undefined,
        hrComment || undefined,
      );
      resetVariables();
    });
  };

  const dialogTitle = isApprove
    ? 'Disapprove Leave Request'
    : 'Approve Leave Request';
  const description = isApprove
    ? 'Are you sure you want to disapprove this leave request?'
    : 'Are you sure you want to approve this leave request?';
  const actionLabel = isApprove ? 'Disapprove' : 'Approve';
  const actionVariant = isApprove ? 'destructive' : 'default';

  return (
    <Dialog
      open={open && type === 'approve'}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm">{description}</p>

        {data?.document && (
          <a
            href={data.document}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center gap-2 text-sm underline-offset-4 hover:underline"
          >
            <FileText className="h-4 w-4" />
            View Leave Application Document
          </a>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            HR Comment <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            placeholder="Leave a comment for the employee..."
            rows={3}
            value={hrComment}
            onChange={(e) => setHrComment(e.target.value)}
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleOpen?.(false, null, null)}
          >
            Cancel
          </Button>
          <CustomButton
            type="button"
            variant={actionVariant}
            isLoading={isPending}
            onClick={onAction}
          >
            {actionLabel}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
