'use client';

import { JSX, useMemo } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder';
import { Pagination } from '@/components/custom/Pagination';
import { Pagination as PaginationTypes } from '@/lib/types/pagination';
import { Certificates as CertificatesType } from '@/lib/types/certificates';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CertificateCard } from './CertificateCard';
import { debounce } from 'lodash';
import { useShallow } from 'zustand/shallow';

interface Certificate extends PaginationTypes {
  certificate: CertificatesType[];
}

export function Certificates({
  certificate,
  totalPages,
  currentPage,
  count,
}: Certificate): JSX.Element {
  const { toggleDialog } = useCertificates(
    useShallow((state) => ({ toggleDialog: state.toggleOpenDialog })),
  );

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
          placeholder="Search document by title..."
          onChange={(event) => onSearch(event)}
          className="max-w-sm"
        />
        <Button onClick={() => toggleDialog?.(true, 'add', null, null)}>
          <PlusIcon /> Request Document
        </Button>
      </div>
      {certificate?.length <= 0 && <EmptyPlaceholder />}
      <div className="xs:grid-cols-1 grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {certificate?.map((item) => (
          <CertificateCard key={item.id} {...item} />
        ))}
      </div>

      <Pagination {...{ totalPages, currentPage, count }} />
    </main>
  );
}
