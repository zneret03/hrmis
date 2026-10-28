'use client';

import { JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

export function PreviousButton(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  // Go up one level, e.g. /backend/{id}/leave-card/{employeeId} → …/leave-card.
  const parentPath = pathname.split('/').slice(0, -1).join('/') || '/';

  const onPreviousPage = (): void => router.push(parentPath);

  return (
    <Button
      variant="ghost"
      className="transparent"
      onClick={() => onPreviousPage()}
    >
      <ChevronLeft />
      Back
    </Button>
  );
}
