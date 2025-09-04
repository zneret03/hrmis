'use client'

import { JSX, useTransition } from 'react'
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog'
import { DialogAlert } from '@/components/custom/DialogAlert'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/shallow'
import { approveDisapprovestatus } from '@/services/leave_applications/leave-applications.services'
import { convertFromAndToDate } from '@/helpers/convertFromAndToDate'

export function ApproveDisapproveDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const { open, type, toggleOpen, data } = useLeaveApplicationDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog
    }))
  )

  const router = useRouter()

  const countDates = convertFromAndToDate(
    data?.start_date as string,
    data?.end_date as string
  )

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null)
    router.refresh()
  }

  const onApproveLeaveRequest = async (): Promise<void> => {
    startTransition(async () => {
      await approveDisapprovestatus(
        'approved',
        data?.users?.id as string,
        data?.id as string,
        countDates
      )
      resetVariables()
    })
  }

  const onDisapproveLeaveRequest = async (): Promise<void> => {
    startTransition(async () => {
      await approveDisapprovestatus(
        'disapproved',
        data?.users?.id as string,
        data?.id as string,
        countDates
      )
      resetVariables()
    })
  }

  const isApprove = data?.status === 'approved'
  const callback = isApprove ? onDisapproveLeaveRequest : onApproveLeaveRequest
  const description = isApprove
    ? 'Do you want to cancel leave request?'
    : 'Do you want to approved leave request?'
  const dialogType = isApprove ? 'error' : 'success'
  const dialogTitle = isApprove ? 'Cancel' : 'Approve'

  return (
    <DialogAlert
      open={open && type === 'approve'}
      title={`${dialogTitle} leave request?`}
      description={description}
      callback={callback}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type={dialogType}
    />
  )
}
