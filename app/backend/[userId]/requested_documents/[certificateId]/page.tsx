import { JSX } from 'react';
import { PdfEditorPage } from '../components/editor/EditorPage';
import { EditorSwitch } from '../components/editor/EditorSwitch';
import { DocumentEditor } from './components/DocumentEditor';
import { getTemplates } from '@/services/template/template.service';
import { UploadExistingDialog } from '../components/editor/UploadExistingDialog';
import { Container } from '@/components/custom/Container';
import { createClient } from '@/config';

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ certificateId: string }>;
  searchParams: Promise<{ page: string; document: string }>;
}): Promise<JSX.Element> {
  const { page, document } = await searchParams;
  const { certificateId } = await params;

  const pdf = document === 'pdf-editor' ? 'pdf' : 'docx';

  const supabase = await createClient();
  const [templatesResponse, certResult] = await Promise.all([
    getTemplates(`?page=${page || 1}&perPage=10&sortBy=created_at&type=${pdf}`),
    supabase
      .from('certificates')
      .select(
        'id, title, certificate_type, certificate_status, reason, created_at',
      )
      .eq('id', certificateId)
      .single(),
  ]);

  const cert = certResult.data;
  const documentDetails = cert
    ? JSON.stringify({
        title: cert.title,
        certificate_type: cert.certificate_type,
        certificate_status: cert.certificate_status,
        reason: cert.reason,
        id: cert.id,
        created_at: cert.created_at ?? '',
      })
    : '';

  return (
    <Container
      title="Document Editor"
      description="You can edit a document here"
    >
      <section className="mb-4">
        <EditorSwitch document={document} />
      </section>
      {document === 'pdf-editor' ? (
        <PdfEditorPage
          {...{
            templates: templatesResponse.templates,
            certificateId,
            documentDetails,
          }}
        />
      ) : (
        <DocumentEditor
          {...{ templates: templatesResponse.templates, certificateId }}
        />
      )}

      <UploadExistingDialog />
    </Container>
  );
}
