import { JSX } from 'react';
import { PdfEditorPage } from '../components/editor/EditorPage';
import { DocumentEditor } from './components/DocumentEditor';
import { Container } from '@/components/custom/Container';

export default async function EditorPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}): Promise<JSX.Element> {
  const { certificateId } = await params;

  return (
    <Container
      title="Document Editor"
      description="You can edit a document here"
    >
      <PdfEditorPage />
      {/* <DocumentEditor certificateId={certificateId} /> */}
    </Container>
  );
}
