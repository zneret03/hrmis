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
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import { useShallow } from 'zustand/react/shallow'
import { useRouter } from 'next/navigation'
import { useUserDialog } from '@/services/auth/states/user-dialog'
import { updatePassword } from '@/services/users/users.services'

interface UpdatePassword {
  password: string
  confirmPassword: string
}

export function UpdatePasswordDialog(): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<UpdatePassword>()

  const { open, toggleOpen, type } = useUserDialog(
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

  const onSubmit = async (data: UpdatePassword): Promise<void> => {
    startTransition(async () => {
      const { password, confirmPassword } = data

      if (password !== confirmPassword) {
        setError('confirmPassword', {
          message: 'Password doesnt match, please try again.'
        })
        return
      }

      await updatePassword(password)
      resetVariables()
    })
  }

  const isOpenDialog = open && type === 'update-password'

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className='sm:max-w-[40rem]'>
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
        </DialogHeader>

        <Input
          type='password'
          title='Password'
          hasError={!!errors.password}
          errorMessage={errors.password?.message}
          {...register('password', {
            required: 'This field is required.'
          })}
        />

        <Input
          type='password'
          title='Confirm Password'
          hasError={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'This field is required.'
          })}
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
              Update
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
