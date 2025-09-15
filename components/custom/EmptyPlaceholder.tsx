import { JSX } from 'react'
import Image from 'next/image'

export function EmptyPlaceholder(): JSX.Element {
  return (
    <div className='flex flex-col items-center justify-center h-[85vh]'>
      <Image
        src='/images/empty.svg'
        alt='empty placeholder'
        width={900}
        height={900}
        className='size-100'
      />
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-bold'>No data</h1>
        <p className='text-sm text-gray-500'>not data displayed 😔</p>
      </div>
    </div>
  )
}
