'use client'

import { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Files } from 'lucide-react'
import { Certificates } from '@/lib/types/certificates'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cardStatus } from '../../personal_management/helpers/constants'
import { useCertificates } from '@/services/certificates/state/use-certificate'
import { useShallow } from 'zustand/shallow'

export function CertificateCard(args: Certificates): JSX.Element {
  const { title, reason, certificate_status } = args

  const { toggleDialog } = useCertificates(
    useShallow((state) => ({ toggleDialog: state.toggleOpenDialog }))
  )

  return (
    <Card className={`${cardStatus[certificate_status]} text-white`}>
      <CardContent className='space-y-2 py-0'>
        <CardTitle className='flex items-center justify-between'>
          <section className='flex items-center gap-2'>
            <Files className='w-5 h-5' />
            {title}
          </section>

          <Badge variant='outline' className='text-white'>
            {certificate_status}
          </Badge>
        </CardTitle>
        {reason}

        {!['cancelled', 'disapproved', 'approved'].includes(
          certificate_status
        ) && (
          <div className='mt-4 text-right'>
            <Button
              className='bg-transparent hover:bg-transparent cursor-pointer underline shadow-none'
              onClick={() => toggleDialog?.(true, 'cancel', { ...args })}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
