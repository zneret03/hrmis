'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function LeavePageHeader(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        File a leave request and track its status below.
      </p>
      <Button onClick={() => router.push(`${pathname}/file_leave`)}>
        <Plus className="mr-2 h-4 w-4" />
        File a Leave
      </Button>
    </div>
  );
}
