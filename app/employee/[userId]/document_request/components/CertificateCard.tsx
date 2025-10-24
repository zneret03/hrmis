'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Files } from 'lucide-react';
import { Certificates } from '@/lib/types/certificates';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cardStatus } from '@/app/helpers/constants';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import Link from 'next/link';
import { useShallow } from 'zustand/shallow';

export function CertificateCard(args: Certificates): JSX.Element {
  const { title, reason, certificate_status, file } = args;

  const { toggleDialog } = useCertificates(
    useShallow((state) => ({ toggleDialog: state.toggleOpenDialog })),
  );

  return (
    <Card className={`${cardStatus[certificate_status]} text-white`}>
      <CardContent className="space-y-2 py-0">
        <CardTitle className="flex items-center justify-between">
          <section className="flex items-center gap-2">
            <Files className="h-5 w-5" />
            {title}
          </section>

          <Badge variant="outline" className="text-white">
            {certificate_status}
          </Badge>
        </CardTitle>
        {reason}

        <div className="mt-4 text-right">
          {!!file && ['approved'].includes(certificate_status) && (
            <Link href={file || ''} target="_blank">
              <Button className="cursor-pointer bg-transparent underline shadow-none hover:bg-transparent">
                Download
              </Button>
            </Link>
          )}
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
