'use client';

import { JSX } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { Button } from '@/components/ui/button';
import { useShallow } from 'zustand/shallow';

export function CertificateDialog(): JSX.Element {
  const { open, type, toggleDialog, data } = useCertificates(
    useShallow((state) => ({
      toggleDialog: state.toggleOpenDialog,
      open: state.open,
      type: state.type,
      data: state.data,
    })),
  );

  const isOpenDialog = open && type === 'view-document-request';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleDialog?.(false, null, null, null)}
    >
      <DialogContent className="sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>Remarks</DialogTitle>
        </DialogHeader>
        {data?.remarks}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
