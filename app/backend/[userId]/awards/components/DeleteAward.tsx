'use client'

import { JSX, useTransition } from 'react'
import { useAwards } from '@/services/awards/state/use-awards'
import { DialogAlert } from '@/components/custom/DialogAlert'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/shallow'
import { updateAward } from '@/services/awards/awards.service'

export function DeleteAward(): JSX.Element {
  const today = new Date()
  const [isPending, startTransition] = useTransition()

  const { open, type, toggleOpen, data } = useAwards(
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

  const onDeleteAward = async (): Promise<void> => {
    startTransition(async () => {
      await updateAward({ archived_at: today }, data?.id as string)
      resetVariables()
    })
  }

  return (
    <DialogAlert
      open={open && type === 'delete'}
      title='Delete Award?'
      description='Do you want to delete this Award?'
      callback={onDeleteAward}
      cancel={() => toggleOpen?.(false, null, null)}
      isLoading={isPending}
      type='error'
    />
  )
}
