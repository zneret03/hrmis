'use client'

import { JSX, useTransition } from 'react'
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog'
import { DialogAlert } from '@/components/custom/DialogAlert'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/shallow'
import { approveDisapprovestatus } from '@/services/leave_applications/leave-applications.services'

export function CancelLeaveDialog(): JSX.Element {
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

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null)
    router.refresh()
  }

  const onCancelLeave = async (): Promise<void> => {
    startTransition(async () => {
      await approveDisapprovestatus(
        'cancelled',
        data?.users?.id as string,
        data?.id as string,
        null
      )
      resetVariables()
    })
  }

  return (
    <DialogAlert
      open={open && type === 'cancel'}
      title={`Cancel leave request?`}
      description='Do you want to cancel this request?'
      callback={onCancelLeave}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type='error'
    />
  )
}
