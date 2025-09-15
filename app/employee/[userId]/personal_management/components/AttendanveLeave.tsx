'use client'

import { JSX } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShallow } from 'zustand/shallow'
import { usePathname, useRouter } from 'next/navigation'
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog'
import { parentPath } from '@/helpers/parentPath'

export function AttendanceLeaves(): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()

  const parentPathname = parentPath(pathname)

  const { toggleOpen } = useLeaveApplicationDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog }))
  )

  const onShowMore = (): void => {
    router.replace(`${parentPathname}/leave_summary`)
  }

  return (
    <div>
      <section className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>File leave</h1>
          <span className='text-gray-500'>You can file your leaves here</span>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={onShowMore}>
            <ChevronDown />
            Show more
          </Button>
          <Button onClick={() => toggleOpen?.(true, 'add', null)}>
            <Plus />
            File leave
          </Button>
        </div>
      </section>
    </div>
  )
}
