'use client';

import { JSX } from 'react';
import { Switch } from '@/components/ui/switch';
import { usePathname, useRouter } from 'next/navigation';

export function EditorSwitch({ document }: { document: string }): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitchEditor = (e: boolean): void => {
    const isDocumentEditor = e ? 'document-editor' : 'pdf-editor';
    router.replace(`${pathname}?document=${isDocumentEditor}`);
  };

  const pdfEditor =
    document === 'pdf-editor' ? 'PDF Editor' : 'Document Editor';

  const isPdfEditor = document === 'pdf-editor';

  return (
    <div className="flex items-center justify-end gap-2">
      <Switch
        value={document}
        checked={!isPdfEditor}
        onCheckedChange={(e) => handleSwitchEditor(e)}
      />
      <span className="font-semibold">{pdfEditor}</span>
    </div>
  );
}
