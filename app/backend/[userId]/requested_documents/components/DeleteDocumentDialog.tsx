'use client'

import { JSX, useTransition } from 'react'
import { useCertificates } from '@/services/certificates/state/use-certificate'
import { DialogAlert } from '@/components/custom/DialogAlert'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/shallow'
import { updateDocument } from '@/services/certificates/certificates.service'

export function DeleteDocumentDialog(): JSX.Element {
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
    toggleOpen?.(false, null, null)
    router.refresh()
  }

  const onDeleteDocument = async (): Promise<void> => {
    startTransition(async () => {
      const today = new Date()
      await updateDocument({ archived_at: today }, data?.id as string)
      resetVariables()
    })
  }

  return (
    <DialogAlert
      open={open && type === 'delete'}
      title='Delete Document Request?'
      description='Do you want to delete this request document?'
      callback={onDeleteDocument}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type='error'
    />
  )
}
