import { JSX } from 'react';
import { PdfEditorPage } from '../components/editor/EditorPage';
import { EditorSwitch } from '../components/editor/EditorSwitch';
import { DocumentEditor } from './components/DocumentEditor';
import { getTemplates } from '@/services/template/template.service';
import { UploadExistingDialog } from '../components/editor/UploadExistingDialog';
import { Container } from '@/components/custom/Container';

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ certificateId: string }>;
  searchParams: Promise<{ page: string; document: string }>;
}): Promise<JSX.Element> {
  const { page, document } = await searchParams;
  const { certificateId } = await params;

  const response = await getTemplates(
    `?page=${page || 1}&perPage=10&sortBy=created_at`,
  );

  return (
    <Container
      title="Document Editor"
      description="You can edit a document here"
    >
      <section className="mb-4">
        <EditorSwitch document={document} />
      </section>
      {document === 'pdf-editor' ? (
        <PdfEditorPage {...{ templates: response.templates }} />
      ) : (
        <DocumentEditor certificateId={certificateId} />
      )}

      <UploadExistingDialog />
    </Container>
  );
}
