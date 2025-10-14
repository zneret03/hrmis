import { DocumentEditor } from './components/DocumentEditor'
import { Container } from '@/components/custom/Container'

export default function EditorPage() {
  return (
    <Container
      title='Document Editor'
      description='You can edit a document here'
    >
      <DocumentEditor />
    </Container>
  )
}
