'use client'

import { useTransition } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { LockOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/custom/ImageUpload'
import { PencilIcon } from 'lucide-react'
import { CustomButton } from '@/components/custom/CustomButton'
import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { avatarName } from '@/helpers/avatarName'
import { UpdateUserInfo, updateUserInfo } from '@/services/users/users.services'
import { UpdateUser } from '@/lib/types/users'

interface SettingsForm extends UpdateUser {
  userId: string
}

interface UserSetting extends Omit<UpdateUser, 'avatar'> {
  oldAvatar: string
  avatar: File[] | string
}

export function SettingsForm({ userId, ...data }: SettingsForm) {
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const {
    control,
    register,
    formState: { errors },
    handleSubmit
  } = useForm<UserSetting>({
    defaultValues: {
      ...data,
      avatar: data.avatar as string,
      username: data?.username as string,
      oldAvatar: data?.avatar as string
    }
  })

  const onSubmit = async (updatedData: UserSetting): Promise<void> => {
    startTransition(async () => {
      const { username, employee_id, avatar, oldAvatar, email } = updatedData

      const newData = {
        username,
        employee_id,
        avatar,
        oldAvatar,
        email,
        id: userId as string
      }

      await updateUserInfo({
        ...newData,
        id: userId as string
      } as UpdateUserInfo)

      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-20 w-20 rounded-full'>
              <AvatarImage
                className='object-cover'
                src={data.avatar as string}
                alt={data.email}
              />
              <AvatarFallback className='text-3xl rounded-lg fill-blue-500 bg-blue-400 text-white font-semibold'>
                {avatarName(data?.email as string)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className='font-bold'>{data.email}</h1>
              <h2>{data.username || 'EMPTY'}</h2>
            </div>
          </div>

          <Button variant='outline'>
            <LockOpen />
            Change Password
          </Button>
        </div>

        <Input
          title='Email'
          hasError={!!errors.email}
          errorMessage={errors.email?.message}
          disabled
          {...register('email', {
            required: 'Field required.'
          })}
        />
        <div className='grid grid-cols-2 gap-2'>
          <Input
            title='Username'
            hasError={!!errors.username}
            errorMessage={errors.username?.message}
            {...register('username', {
              required: 'Field required.'
            })}
          />
          <Input
            title='Employee ID'
            hasError={!!errors.employee_id}
            errorMessage={errors.employee_id?.message}
            {...register('employee_id', {
              required: 'Field required.'
            })}
          />
        </div>

        <div className='space-y-2'>
          <Controller
            name='avatar'
            control={control}
            render={({ field: { onChange, value } }) => (
              <ImageUpload
                title='Image'
                filePreview={typeof value === 'string' ? value : undefined}
                pendingFiles={value as File[]}
                isLoading={isPending}
                acceptedImageCount={1}
                setPendingFiles={(value) => onChange(value)}
              />
            )}
          />
          {!!errors.avatar && (
            <Label className='text-sm text-red-500'>
              {errors.avatar.message}
            </Label>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex items-center gap-2 justify-end'>
        <CustomButton
          type='button'
          isLoading={isPending}
          onClick={handleSubmit(onSubmit)}
        >
          <PencilIcon />
          Update
        </CustomButton>
      </CardFooter>
    </Card>
  )
}
