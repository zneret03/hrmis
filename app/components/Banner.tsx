import { JSX } from 'react';
import Link from 'next/link';

interface Banner {
  path: string;
  rewardCount: number;
}

export function Banner({ path, rewardCount }: Banner): JSX.Element {
  return (
    <div className="fixed top-0 z-50 w-full bg-blue-500 py-2 text-center text-sm text-white">
      🎉🥳 Congratulations! You have {rewardCount} unclaimed rewards. To view
      your awards, please click{' '}
      <Link href={path}>
        <span className="font-semibold underline">here</span>
      </Link>
      .🥳🎉
    </div>
  );
}
