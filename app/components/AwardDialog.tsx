'use client'

import { JSX } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Medal } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAwards } from '@/services/awards/state/use-awards'
import { useShallow } from 'zustand/shallow'

export function AwardDialog(): JSX.Element {
  const router = useRouter()

  const { toggleOpen, type, open, data } = useAwards(
    useShallow((state) => ({
      toggleOpen: state.toggleOpenDialog,
      type: state.type,
      open: state.open,
      data: state.data
    }))
  )

  const onClose = (): void => {
    toggleOpen?.(false, null, null)
    router.refresh()
  }

  const isOpenDialog = open && type === 'read'

  return (
    <Dialog open={isOpenDialog} onOpenChange={() => onClose()}>
      <DialogContent className='sm:max-w-[40rem]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Medal className='text-yellow-500' />
            Congratulations {data?.users?.username}
          </DialogTitle>
        </DialogHeader>

        <Image
          src='/images/awarded.jpeg'
          width={500}
          height={500}
          className='w-full h-full rounded-lg'
          alt='awardee'
        />

        <h1 className='text-xl font-semibold'>{data?.title as string}</h1>
        <p>{data?.description}</p>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
