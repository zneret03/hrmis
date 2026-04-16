'use client';

import { JSX, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Files } from 'lucide-react';
import { Certificates } from '@/lib/types/certificates';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { updateDocument } from '@/services/certificates/certificates.service';
import { cardStatus } from '@/app/helpers/constants';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

export function CertificateCard(args: Certificates): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { title, reason, certificate_status, read_at, id } = args;

  const router = useRouter();

  const { toggleDialog } = useCertificates(
    useShallow((state) => ({ toggleDialog: state.toggleOpenDialog })),
  );

  const readNotification = (): void => {
    startTransition(async () => {
      const today = new Date();
      await updateDocument({ read_at: today }, id, false);
      toggleDialog?.(true, 'view-document-request', null, { ...args });
      router.refresh();
    });
  };

  return (
    <Card
      className={`${cardStatus[certificate_status]} cursor-pointer text-white ${!read_at && 'ring-2 ring-blue-500'}`}
      onClick={() => readNotification()}
    >
      <CardContent className="space-y-2 py-0">
        <CardTitle className="flex items-center justify-between">
          <section className="flex items-center gap-2">
            <Files className="h-5 w-5" />
            {title}
          </section>

          {/* <Badge variant="outline" className="text-white"> */}
          {/*   {certificate_status} */}
          {/* </Badge> */}
        </CardTitle>
        {isPending ? 'Please wait...' : reason}

        <div className="mt-4 text-right">
          {/* {!!file && ['approved'].includes(certificate_status) && ( */}
          {/*   <Link href={file || ''} target="_blank"> */}
          {/*     <Button className="cursor-pointer bg-transparent underline shadow-none hover:bg-transparent"> */}
          {/*       Download */}
          {/*     </Button> */}
          {/*   </Link> */}
          {/* )} */}
          {!['cancelled', 'disapproved', 'approved'].includes(
            certificate_status,
          ) && (
            <Button
              className="cursor-pointer bg-transparent underline shadow-none hover:bg-transparent"
              onClick={() => toggleDialog?.(true, 'cancel', null, { ...args })}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
