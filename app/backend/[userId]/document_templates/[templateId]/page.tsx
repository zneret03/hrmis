import { JSX } from 'react';
import PdfEditorPage from '../../requested_documents/components/editor/EditorPage';
import { DocumentEditor } from '../../requested_documents/[certificateId]/components/DocumentEditor';
import { getTemplate } from '@/services/template/template.service';
import { UploadExistingDialog } from '../../requested_documents/components/editor/UploadExistingDialog';
import { Container } from '@/components/custom/Container';

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ type: string; page: string; document: string }>;
}): Promise<JSX.Element> {
  const { templateId } = await params;
  const { type } = await searchParams;

  const response = await getTemplate(templateId);

  return (
    <Container
      title="Document Editor"
      description="You can edit a document here"
    >
      {type === 'pdf' ? (
        <PdfEditorPage {...{ template: response }} />
      ) : (
        <DocumentEditor {...{ serverTemplate: response }} />
      )}

      <UploadExistingDialog />
    </Container>
  );
}
