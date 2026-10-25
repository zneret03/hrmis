'use client';

import { JSX } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

/**
 * Pagination that preserves the other query params (e.g. ?status, ?period) when
 * changing pages — unlike the base Pagination, which resets the query string.
 */
export const PaginationControls = ({
  totalPages,
  currentPage,
}: PaginationControlsProps): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (page: number): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const safeTotal = Math.max(totalPages, 1);

  return (
    <div className="flex items-center justify-end gap-4 py-4">
      <span className="text-muted-foreground text-sm">
        Page {currentPage} of {safeTotal}
      </span>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => goTo(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= safeTotal}
          onClick={() => goTo(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
