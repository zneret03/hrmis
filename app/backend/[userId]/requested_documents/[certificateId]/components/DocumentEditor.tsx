'use client';

import { JSX, useRef, useTransition, useEffect, useState } from 'react';
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
} from '@syncfusion/ej2-react-documenteditor';
import { CustomButton } from '@/components/custom/CustomButton';
import { Plus, Pencil } from 'lucide-react';
import dynamic from 'next/dynamic';
import { registerLicense } from '@syncfusion/ej2-base';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { approveCustomDocument } from '@/services/certificates/certificates.service';
import { parentPath } from '@/helpers/parentPath';
import { useTemplateDialog } from '@/services/template/state/template-state';
import { useShallow } from 'zustand/shallow';
import { AddTemplateDialog } from './UploadDocumentTemplate';
import { TemplateDB } from '@/lib/types/template';

// eslint-disable-next-line @typescript-eslint/naming-convention
const DocumentEditorContainerComponentSSR = dynamic(
  () =>
    import('@syncfusion/ej2-react-documenteditor').then(
      (mod) => mod.DocumentEditorContainerComponent,
    ),
  { ssr: false },
);

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_KEY as string);

interface DocumentEditor {
  certificateId?: string;
  serverTemplate?: TemplateDB;
  templates?: TemplateDB[];
  isEdit?: boolean;
}

const serviceUrl = 'http://localhost:6002/api/documenteditor';

export function DocumentEditor({
  certificateId,
  serverTemplate,
  templates,
  isEdit,
}: DocumentEditor): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [template, setTemplate] = useState<TemplateDB | null>(null);
  const editor = useRef<DocumentEditorContainerComponent | null>(null);

  const { toggleOpen } = useTemplateDialog(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  const router = useRouter();
  const pathname = usePathname();

  const onApprove = async (): Promise<void> => {
    if (!editor.current?.documentEditor) {
      console.error('Document editor is not available.');
      return;
    }

    const editorInstance = editor.current.documentEditor;

    if (!editorInstance) {
      alert('The document editor instance is not ready.');
      return;
    }

    try {
      if (editor.current) {
        const docxBlob = await editorInstance.saveAsBlob('Docx');
        await approveCustomDocument(docxBlob, certificateId as string);
        router.replace(parentPath(pathname));
      }
    } catch (error) {
      let errorMessage = 'Could not save the document.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Save error:', errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  const selectTemplate = (template: TemplateDB): void => {
    setTemplate(template);
  };

  const onSave = async (): Promise<void> => {
    startTransition(async () => {
      if (!editor.current?.documentEditor) {
        console.error('Document editor is not available.');
        return;
      }

      const editorInstance = editor.current.documentEditor;

      if (!editorInstance) {
        alert('The document editor instance is not ready.');
        return;
      }

      try {
        if (editor.current) {
          const docxBlob = await editorInstance.saveAsBlob('Docx');
          toggleOpen?.(true, 'add', {
            blob: docxBlob as Blob,
            type: 'docx' as string,
          });
        }
      } catch (error) {
        let errorMessage = 'Could not save the document.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.error('Save error:', errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    });
  };

  const renderNewTemplate = async (formData: FormData): Promise<void> => {
    const response = await fetch(`${serviceUrl}/Import`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Import failed');

    const sfdt = await response.json();
    editor.current?.documentEditor?.open(JSON.stringify(sfdt));
  };

  useEffect(() => {
    const renderTemplate = async (): Promise<void> => {
      try {
        const formData = new FormData();
        const responseOne = await fetch(template?.file as string);

        const blob = await responseOne.blob();

        const file = new File([blob], 'new-docx');
        formData.append('files', file);

        renderNewTemplate(formData);
      } catch (error) {
        console.error('Import error:', error);
      }
    };

    const renderSingleTemplate = async (): Promise<void> => {
      try {
        const formData = new FormData();
        const responseOne = await fetch(serverTemplate?.file as string);

        const blob = await responseOne.blob();

        const file = new File([blob], 'new-docx');
        formData.append('files', file);

        renderNewTemplate(formData);
      } catch (error) {
        console.error('Import error:', error);
      }
    };

    if (serverTemplate) {
      renderSingleTemplate();
    }

    if (template) {
      renderTemplate();
    }
  }, [template, serverTemplate]);

  const isDisableTemplate = !pathname.endsWith('template_editor');

  const templateArr =
    Object.keys((serverTemplate as TemplateDB) || []).length <= 0
      ? templates
      : [serverTemplate];

  return (
    <main className="space-y-4">
      {isDisableTemplate && (
        <div className="space-y-2">
          <h1 className="font-semibold">Templates</h1>

          <section className="flex gap-2">
            {(templateArr as TemplateDB[])?.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer rounded-sm px-4 py-2 font-semibold text-gray-500 ring ring-gray-500/50 hover:text-black hover:ring-gray-500 focus:text-black focus:ring-gray-500"
                onClick={() => selectTemplate(item)}
              >
                {item?.name}
              </div>
            ))}
          </section>
        </div>
      )}
      <section className="text-right">
        {!!certificateId ? (
          <Button onClick={onApprove}>
            <Plus /> Approve Document
          </Button>
        ) : isEdit ? (
          <Button>
            <Pencil /> Update Template
          </Button>
        ) : (
          <CustomButton
            disabled={isPending}
            isLoading={isPending}
            onClick={onSave}
          >
            <Plus /> Save Template
          </CustomButton>
        )}
      </section>
      <DocumentEditorContainerComponentSSR
        ref={editor}
        id="container"
        height="800px"
        width="100%"
        serviceUrl={`${serviceUrl}/`}
        toolbarItems={[
          'Open',
          'Separator',
          'Undo',
          'Redo',
          'Separator',
          'Image',
          'Table',
          'Hyperlink',
          'Bookmark',
          'TableOfContents',
          'Separator',
          'Header',
          'Footer',
          'PageNumber',
          'Break',
          'Separator',
          'Find',
          'Separator',
          'TrackChanges',
          'Separator',
        ]}
        enableToolbar={true}
      >
        <Inject services={[Toolbar]}></Inject>
      </DocumentEditorContainerComponentSSR>
      <AddTemplateDialog />
    </main>
  );
}
