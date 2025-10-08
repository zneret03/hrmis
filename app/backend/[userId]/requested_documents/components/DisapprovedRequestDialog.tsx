'use client'

import { JSX, useTransition } from 'react'
import { DialogAlert } from '@/components/custom/DialogAlert'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/shallow'
import { updateDocument } from '@/services/certificates/certificates.service'
import { useCertificates } from '@/services/certificates/state/use-certificate'

export function DisapproveRequestDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const { open, type, toggleOpen, data } = useCertificates(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      data: state.data,
      toggleOpen: state.toggleOpenDialog
    }))
  )

  const router = useRouter()

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null, null)
    router.refresh()
  }

  const onDisapproveLeaveRequest = async (): Promise<void> => {
    startTransition(async () => {
      await updateDocument(
        { certificate_status: 'disapproved' },
        data?.id as string
      )
      resetVariables()
    })
  }

  return (
    <DialogAlert
      open={open && type === 'disapprove'}
      title={`Disapproved Certificate Request?`}
      description='Would you like to disapproved this request?'
      callback={onDisapproveLeaveRequest}
      cancel={() => toggleOpen?.(false, null, null, null)}
      isLoading={isPending}
      type='error'
    />
  )
}
