import { JSX } from 'react';
import Image from 'next/image';

export function EmptyPlaceholder({
  description = 'no data displayed',
}): JSX.Element {
  return (
    <div className="flex h-[85vh] flex-col items-center justify-center">
      <Image
        src="/images/empty.svg"
        alt="empty placeholder"
        width={900}
        height={900}
        className="size-100"
      />
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">No data</h1>
        <p className="text-sm text-gray-500">{description} 😔</p>
      </div>
    </div>
  );
}
