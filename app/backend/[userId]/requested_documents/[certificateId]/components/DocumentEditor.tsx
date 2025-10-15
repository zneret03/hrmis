'use client'

import { JSX, useRef } from 'react'
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject
} from '@syncfusion/ej2-react-documenteditor'
import { Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { registerLicense } from '@syncfusion/ej2-base'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { approveCustomDocument } from '@/services/certificates/certificates.service'
import { parentPath } from '@/helpers/parentPath'

// eslint-disable-next-line @typescript-eslint/naming-convention
const DocumentEditorContainerComponentSSR = dynamic(
  () =>
    import('@syncfusion/ej2-react-documenteditor').then(
      (mod) => mod.DocumentEditorContainerComponent
    ),
  { ssr: false }
)

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_KEY as string)

interface DocumentEditor {
  certificateId: string
}

export function DocumentEditor({ certificateId }: DocumentEditor): JSX.Element {
  const editor = useRef<DocumentEditorContainerComponent | null>(null)

  const router = useRouter()
  const pathname = usePathname()

  const onSave = async (): Promise<void> => {
    if (!editor.current?.documentEditor) {
      console.error('Document editor is not available.')
      return
    }

    const editorInstance = editor.current.documentEditor

    if (!editorInstance) {
      alert('The document editor instance is not ready.')
      return
    }

    try {
      if (editor.current) {
        const docxBlob = await editorInstance.saveAsBlob('Docx')
        await approveCustomDocument(docxBlob, certificateId)
        router.replace(parentPath(pathname))
      }
    } catch (error) {
      let errorMessage = 'Could not save the document.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      console.error('Save error:', errorMessage)
      alert(`Error: ${errorMessage}`)
    }
  }

  return (
    <main className='space-y-4'>
      <section className='text-right'>
        <Button onClick={onSave}>
          <Plus /> Approve Document
        </Button>
      </section>
      <DocumentEditorContainerComponentSSR
        ref={editor}
        id='container'
        height={'800px'}
        width={'100%'}
        serviceUrl='/api/docx'
        enableToolbar={true}
      >
        <Inject services={[Toolbar]}></Inject>
      </DocumentEditorContainerComponentSSR>
    </main>
  )
}
