'use client'

import { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlaneIcon } from 'lucide-react'
import { format } from 'date-fns'
import { LeaveApplicationsForm } from '@/lib/types/leave_application'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useLeaveApplicationDialog } from '@/services/leave_applications/states/leave-application-dialog'
import { useShallow } from 'zustand/shallow'

export function LeaveCard(args: LeaveApplicationsForm): JSX.Element {
  const { leave_categories, start_date, end_date, remarks, status } = args

  const { toggleOpen } = useLeaveApplicationDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog }))
  )

  return (
    <Card className='bg-green-500 text-white'>
      <CardContent className='space-y-2 py-0'>
        <CardTitle className='flex items-center justify-between'>
          <section className='flex items-center gap-2'>
            <PlaneIcon className='w-5 h-5' />
            {leave_categories.name}
          </section>

          <Badge variant='outline' className='text-white'>
            {status}
          </Badge>
        </CardTitle>
        {remarks}

        <div>
          <span>
            {format(start_date as string, "MMMM dd, yyyy hh:mm aaaaa'm'")}
          </span>{' '}
          - <span>{format(end_date as string, 'MMMM dd, yyyy')}</span>
        </div>

        <div className='mt-4 text-right'>
          <Button
            className='bg-transparent hover:bg-transparent cursor-pointer underline shadow-none'
            onClick={() => toggleOpen?.(true, 'cancel', { ...args })}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
