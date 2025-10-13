'use client'

import { useEffect, useRef, useCallback, JSX } from 'react'
import { Import, FolderUp } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SuperDocEditor {
  export: () => void
  setHeader?: (content: string) => void
  setFooter?: (content: string) => void
  insertPageNumber?: (position: 'header' | 'footer') => void
}

interface SuperDocInstance {
  activeEditor: SuperDocEditor
  export: () => void
}

interface SuperDocConfig {
  selector: HTMLElement | null
  modules?: {
    toolbar?: {
      selector: string
      toolbarGroups?: string[]
    }
    headersAndFooters?: {
      enabled: boolean
      differentFirstPage?: boolean
      oddEvenPages?: boolean
    }
  }
  pagination?: boolean
  rulers?: boolean
  onReady?: () => void
  onEditorCreate?: (event: unknown) => void
  document?: { data: File | null }
}

export default function SuperDocEditor(): JSX.Element {
  const superdocContainerRef = useRef<HTMLDivElement | null>(null)
  const superdoc = useRef<SuperDocInstance | null>(null)
  const editor = useRef<SuperDocEditor | null>(null)
  const fileUploadRef = useRef<HTMLInputElement | null>(null)

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const onReady = useCallback(() => {
    editor.current = superdoc.current?.activeEditor ?? null

    if (editor.current) {
      editor.current.setHeader?.(`Document - ${currentDate}`)
      editor.current.setFooter?.('Page {PAGE} | © 2025')
      editor.current.insertPageNumber?.('footer')
    }
  }, [currentDate])

  const initSuperDoc = useCallback(
    async (fileToLoad: File | null = null) => {
      if (typeof window === 'undefined') return

      try {
        const { SuperDoc } = await import('superdoc')
        const config: SuperDocConfig = {
          selector: superdocContainerRef.current,
          modules: {
            toolbar: {
              selector: '#toolbar',
              toolbarGroups: ['center', 'headersFooters'] // Add headers/footers toolbar group
            },
            headersAndFooters: {
              enabled: true,
              differentFirstPage: true, // Optional: unique first page header/footer
              oddEvenPages: false
            }
          },
          pagination: true,
          rulers: true,
          onReady,
          onEditorCreate: (event: unknown) => {
            console.log('Editor is created', event)
          }
        }

        if (fileToLoad) {
          config.document = { data: fileToLoad }
        }

        superdoc.current = new SuperDoc(config)
      } catch (error) {
        console.error('Failed to initialize SuperDoc:', error)
      }
    },
    [onReady]
  )

  useEffect(() => {
    initSuperDoc()
  }, [initSuperDoc])

  const handleImport = useCallback(async () => {
    if (!superdocContainerRef.current) return
    fileUploadRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        initSuperDoc(file)
      }
    },
    [initSuperDoc]
  )

  const handleExport = useCallback(async () => {
    if (superdoc.current) {
      console.debug('Exporting document', superdoc.current)
      superdoc.current.export()
    }
  }, [])

  return (
    <div>
      <section>
        <section className='flex items-center justify-center'>
          <div id='toolbar' />
          <div className='flex items-center gap-3'>
            <Import
              className='cursor-pointer'
              color='#47484A'
              size='20'
              onClick={handleImport}
            />
            <FolderUp
              size='20'
              color='#47484A'
              className='cursor-pointer'
              onClick={handleExport}
            />
            <div className='editor-buttons'>
              <Input
                ref={fileUploadRef}
                onChange={handleChange}
                style={{ display: 'none' }}
                type='file'
                accept='.docx'
              />
            </div>
          </div>
        </section>
      </section>
      <div
        id='superdoc'
        className='flex items-center justify-center'
        ref={superdocContainerRef}
      />
    </div>
  )
}
