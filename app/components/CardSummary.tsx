import { JSX, ReactNode } from 'react'
import { Card, CardTitle, CardContent } from '@/components/ui/card'

interface CardSummary {
  title: string
  icon: ReactNode
  count: number
}

export function CardSummary({ title, icon, count }: CardSummary): JSX.Element {
  return (
    <Card className='w-full'>
      <CardContent>
        <div className='flex items-center justify-between'>
          <CardTitle className='font-medium text-gray-500 xl:text-md lg:text-md md:text-sm'>
            {title}
          </CardTitle>
          {icon}
        </div>
        <span className='text-blue-500 font-medium xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl'>
          {count}
        </span>
      </CardContent>
    </Card>
  )
}
