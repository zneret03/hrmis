import { JSX } from 'react'
import Link from 'next/link'

interface Banner {
  path: string
  rewardCount: number
}

export function Banner({ path, rewardCount }: Banner): JSX.Element {
  return (
    <div className='fixed w-full top-0 bg-blue-500 py-2 z-50 text-white text-sm text-center'>
      🎉🥳 Congratulations! You have {rewardCount} unclaimed rewards. To view
      your awards, please click{' '}
      <Link href={path}>
        <span className='font-semibold underline'>here</span>
      </Link>
      .🥳🎉
    </div>
  )
}
