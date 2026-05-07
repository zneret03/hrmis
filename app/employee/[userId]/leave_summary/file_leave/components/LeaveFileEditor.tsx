'use client';

import { JSX, useState } from 'react';
import { PdfEditorPage } from '@/app/backend/[userId]/requested_documents/components/editor/EditorPage';
import { FileLeaveDetailsDialog } from './FileLeaveDetailsDialog';
import { LeaveCategories } from '@/lib/types/leave_categories';

interface LeaveFileEditorProps {
  category: Pick<LeaveCategories, 'name' | 'id'>[];
}

export function LeaveFileEditor({ category }: LeaveFileEditorProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const handleSave = (blob: Blob): void => {
    setPdfBlob(blob);
    setShowModal(true);
  };

  return (
    <>
      <PdfEditorPage
        defaultPdfUrl="/documents/Application Leave Form.pdf"
        onSave={handleSave}
      />
      <FileLeaveDetailsDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        category={category}
        pdfBlob={pdfBlob}
      />
    </>
  );
}
