import { JSX } from 'react';
import PdfEditorPage from '../../requested_documents/components/editor/EditorPage';
import { EditorSwitch } from '../../requested_documents/components/editor/EditorSwitch';
import { DocumentEditor } from '../../requested_documents/[certificateId]/components/DocumentEditor';
import { getTemplates } from '@/services/template/template.service';
import { UploadExistingDialog } from '../../requested_documents/components/editor/UploadExistingDialog';
import { Container } from '@/components/custom/Container';

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; document: string }>;
}): Promise<JSX.Element> {
  const { page, document } = await searchParams;

  const pdf = document === 'pdf-editor' ? 'pdf' : 'docx';

  const response = await getTemplates(
    `?page=${page || 1}&perPage=10&sortBy=created_at&type=${pdf}`,
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
        <DocumentEditor {...{ templates: response.templates }} />
      )}

      <UploadExistingDialog />
    </Container>
  );
}
