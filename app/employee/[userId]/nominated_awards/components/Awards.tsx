'use client';

import { JSX, useMemo } from 'react';
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder';
import { Pagination } from '@/components/custom/Pagination';
import { Pagination as PaginationTypes } from '@/lib/types/pagination';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { AwardCard } from './AwardsCard';
import { debounce } from 'lodash';
import { Awards as AwardsType } from '@/lib/types/awards';
import { ConfettiFireworks } from '@/components/custom/Confetti';

interface Awards extends PaginationTypes {
  awards: AwardsType[];
}

export function Awards({
  awards,
  totalPages,
  currentPage,
  count,
}: Awards): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  const onDebounce = useMemo(
    () =>
      debounce((value) => {
        if (!!value) {
          router.replace(`${pathname}?page=${currentPage}&search=${value}`);
          return;
        }

        router.replace(`${pathname}?page=${currentPage}`);
      }, 500),
    [pathname, router, currentPage],
  );

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    onDebounce(value);
  };

  return (
    <main className="space-y-8">
      <div className="flex items-center">
        <Input
          placeholder="Search awards by title..."
          onChange={(event) => onSearch(event)}
          className="max-w-sm"
        />
      </div>
      {awards?.length <= 0 && <EmptyPlaceholder />}
      <div className="xs:grid-cols-1 grid grid-cols-3 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {awards?.map((item) => (
          <ConfettiFireworks key={item.id}>
            <AwardCard {...item} />
          </ConfettiFireworks>
        ))}
      </div>

      <Pagination {...{ totalPages, currentPage, count }} />
    </main>
  );
}
