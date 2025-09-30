'use client'

import { JSX, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import { useShallow } from 'zustand/react/shallow'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Awards } from '@/lib/types/awards'
import { useAwards } from '@/services/awards/state/use-awards'

type AwardsForm = Partial<Awards>

export function NominateDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AwardsForm>()

  const router = useRouter()

  const { open, toggleOpen, type } = useAwards(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog
    }))
  )

  const resetVariables = (): void => {
    toggleOpen?.(false, null, null)
    router.refresh()
  }

  const onSubmit = async (data: AwardsForm): Promise<void> => {
    startTransition(async () => {
      console.info(data)
      resetVariables()
      // await addLeaveCategories(name as string)
      // resetVariables()
    })
  }

  const isOpenDialog = open && type === 'add'

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className='sm:max-w-[40rem]'>
        <DialogHeader>
          <DialogTitle>Nominate User</DialogTitle>
        </DialogHeader>

        <Input
          title='Name'
          {...register('year', {
            required: 'Required field.'
          })}
          hasError={!!errors.year}
          errorMessage={errors.year?.message}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <CustomButton
              type='button'
              isLoading={isPending}
              onClick={handleSubmit(onSubmit)}
            >
              Create
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
