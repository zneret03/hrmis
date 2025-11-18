'use client';

import React, { useState, useRef, JSX, useTransition, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Document, pdfjs } from 'react-pdf';
import { Plus, UploadCloud, Pencil } from 'lucide-react';
import { Spinner } from '@/components/custom/Spinner';
import { drawCheckmark } from '@/helpers/drawCheckBox';
import { useCertificates } from '@/services/certificates/state/use-certificate';
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder';
import { approveCustomDocument } from '@/services/certificates/certificates.service';
import { parentPath } from '@/helpers/parentPath';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { Toolbox } from './Toolbox';
import { PdfPageDroppable } from './PdfPageDroppable';
import {
  PlacedField,
  PlacedFieldDragData,
  ToolboxDragData,
} from '@/lib/types/DraggableTypes';
import { Button } from '@/components/ui/button';
import { PageCallback } from 'react-pdf/dist/shared/types.js';
import { useShallow } from 'zustand/shallow';
import { TemplateDB } from '@/lib/types/template';
// import { downloadFile } from '@/helpers/downloadFile';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfEditorPage {
  template?: TemplateDB;
  templates?: TemplateDB[];
  certificateId?: string;
  isEdit?: boolean;
}

export function PdfEditorPage({
  template,
  templates,
  certificateId,
  isEdit,
}: PdfEditorPage): JSX.Element {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageDimensions, setPageDimensions] = useState<
    { width: number; height: number }[]
  >([]);
  const [fields, setFields] = useState<PlacedField[]>([]);
  const [isPending, startTransition] = useTransition();

  const pdfCanvasContainerRef = useRef<HTMLDivElement>(null);
  const uploadPdfRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const { toggleOpen } = useCertificates(
    useShallow((state) => ({ toggleOpen: state.toggleOpenDialog })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleSelectedFile = async (
    file: string,
    name: string,
  ): Promise<void> => {
    startTransition(async () => {
      const response = await fetch(file);

      if (!response.ok) {
        toast.error('ERROR!!', {
          description: 'Something went wrong',
        });
        return;
      }

      const blob = await response.blob();

      const newFile = new File([blob], name);
      setPdfFile(newFile);
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setFields([]);
      setNumPages(0);
      setPageDimensions([]);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageDimensions(Array(numPages).fill({ width: 0, height: 0 }));
  };

  const onPageLoadSuccess = (pageIndex: number, page: PageCallback) => {
    setPageDimensions((prev) => {
      const newDims = [...prev];
      newDims[pageIndex] = { width: page.width, height: page.height };
      return newDims;
    });
  };

  const handleFieldUpdate = (
    id: string,
    value: Partial<PlacedField> | string,
  ) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id
          ? typeof value === 'string'
            ? { ...f, value }
            : { ...f, ...value }
          : f,
      ),
    );
  };

  const onHandleEdit = async (): Promise<void> => {
    alert('clicked');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    const dragData = active.data.current as
      | PlacedFieldDragData
      | ToolboxDragData;

    const placedFieldDragData = dragData as PlacedFieldDragData;
    const toolboxDragData = dragData as ToolboxDragData;

    if (placedFieldDragData.isPlacedField) {
      const fieldId = active.id;
      if (over && over.id.toString().startsWith('pdf-page-')) {
        const pageNumber = parseInt(over.id.toString().split('-')[2], 10);
        setFields((prevFields) =>
          prevFields.map((field) => {
            if (field.id === fieldId) {
              return {
                ...field,
                page: pageNumber,
                x: field.x + delta.x,
                y: field.y + delta.y,
              };
            }
            return field;
          }),
        );
      } else {
        setFields((prevFields) =>
          prevFields.filter((field) => field.id !== fieldId),
        );
      }
      return;
    }

    if (toolboxDragData.isToolboxItem && over) {
      const pageId = over.id.toString();
      if (!pageId.startsWith('pdf-page-')) return;

      const pageNumber = parseInt(pageId.split('-')[2], 10);
      const pageRect = over.rect;
      const dropX = (event.activatorEvent as MouseEvent).clientX;
      const dropY = (event.activatorEvent as MouseEvent).clientY;

      let x = dropX - pageRect.left;
      let y = dropY - pageRect.top;
      x -= toolboxDragData.width / 2;
      y -= toolboxDragData.height / 2;

      const newField: PlacedField = {
        id: uuidv4(),
        type: toolboxDragData.type,
        page: pageNumber,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: toolboxDragData.width,
        height: toolboxDragData.height,
        value: '',
      };
      setFields((prevFields) => [...prevFields, newField]);
    }
  };

  const handleSave = async () => {
    if (!pdfFile) {
      alert('Please load a PDF first.');
      return;
    }

    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      for (const field of fields) {
        const page = pages[field.page - 1];
        if (!page) continue;

        const pageHeight = page.getHeight();
        const nativeWidth = page.getWidth();

        const renderWidth = 1200;

        const scale = nativeWidth / renderWidth;

        const scaledX = field.x * scale;
        const scaledYTopDown = field.y * scale;
        const scaledHeight = field.height * scale;
        const scaledWidth = field.width * scale;

        const fontSize = 10;
        const padding = 5;

        const pdfY = pageHeight - scaledYTopDown - scaledHeight;
        const pdfX = scaledX;
        const textY = pdfY + scaledHeight - fontSize - padding;

        switch (field.type) {
          case 'text':
            page.drawText(field.value || '', {
              x: pdfX + 2,
              y: pdfY + 3,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
            break;

          case 'textarea':
            page.drawText(field.value || '', {
              x: pdfX + 5,
              y: textY + 3,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
              lineHeight: 10,
            });
            break;

          case 'checkbox':
            if (field.checked) {
              const checkX = pdfX + scaledYTopDown / 4;
              const checkY = pdfY + scaledHeight / 4;

              drawCheckmark(page, {
                x: checkX - 38,
                y: checkY,
                size: 12,
              });
            }
            break;

          case 'image':
            if (field.value && field.value.startsWith('data:image/')) {
              try {
                let embeddedImage;

                if (field.value.startsWith('data:image/png')) {
                  embeddedImage = await pdfDoc.embedPng(field.value);
                } else if (field.value.startsWith('data:image/jpeg')) {
                  embeddedImage = await pdfDoc.embedJpg(field.value);
                } else {
                  console.warn('Unsupported signature image type');
                  continue;
                }

                page.drawImage(embeddedImage, {
                  x: pdfX,
                  y: pdfY,
                  width: scaledWidth,
                  height: scaledHeight,
                });
              } catch (embedError) {
                console.error('Failed to embed signature image:', embedError);
              }
            }

          case 'signature':
            if (field.value && field.value.startsWith('data:image/')) {
              try {
                let embeddedImage;

                if (field.value.startsWith('data:image/png')) {
                  embeddedImage = await pdfDoc.embedPng(field.value);
                } else if (field.value.startsWith('data:image/jpeg')) {
                  embeddedImage = await pdfDoc.embedJpg(field.value);
                } else {
                  console.warn('Unsupported signature image type');
                  continue;
                }

                page.drawImage(embeddedImage, {
                  x: pdfX,
                  y: pdfY,
                  width: scaledWidth,
                  height: scaledHeight,
                });
              } catch (embedError) {
                console.error('Failed to embed signature image:', embedError);
              }
            }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], {
        type: 'application/pdf',
      });

      // downloadFile(blob, pdfFile.name);

      await approveCustomDocument(blob, certificateId as string);
      router.replace(parentPath(pathname));
    } catch (err) {
      console.error('Error saving PDF:', err);
      console.info(pageDimensions);
      alert('An error occurred while saving the PDF.');
    }
  };

  const onError = (error: string): void => {
    toast.error('Error!!', {
      description: error,
    });
  };

  useEffect(() => {
    const renderSingleTemplate = async (): Promise<void> => {
      const response = await fetch(template?.file as string);

      const blob = await response.blob();
      const file = new File([blob], 'new-file');

      setPdfFile(file);
    };

    if (template) {
      renderSingleTemplate();
    }
  }, [template]);

  const isTemplateEditor =
    pathname.endsWith('template_editor') ||
    Object.keys((template as TemplateDB) || []).length > 0;

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="flex h-screen flex-col">
        {/* Top Bar */}
        <div className="flex flex-shrink-0 items-center justify-end border-b border-gray-300 bg-white px-4 py-3">
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => toggleOpen?.(true, 'upload-existing', null, null)}
            >
              <UploadCloud /> Upload existing pdf
            </Button>
            {isEdit && (
              <Button onClick={onHandleEdit}>
                <Pencil /> Update PDF
              </Button>
            )}
            <input
              ref={uploadPdfRef}
              onChange={onFileChange}
              type="file"
              accept="application/pdf"
              hidden
            />

            {!!certificateId && (
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={!pdfFile || fields.length === 0}
              >
                <Plus />
                Approve Request
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          <Toolbox
            templates={templates ?? []}
            callback={handleSelectedFile}
            isTemplateEditor={isTemplateEditor}
          />

          <div
            ref={pdfCanvasContainerRef}
            className="flex-grow overflow-auto bg-gray-200/20 p-5"
          >
            {isPending ? (
              <div className="flex items-center justify-center py-30">
                <Spinner />
              </div>
            ) : (
              <main>
                {pdfFile ? (
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => onError(error.message)}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <PdfPageDroppable
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        fields={fields}
                        onFieldUpdate={handleFieldUpdate}
                        onPageLoad={(page) => onPageLoadSuccess(index, page)}
                      />
                    ))}
                  </Document>
                ) : (
                  <div className="p-5 text-center text-gray-600">
                    <EmptyPlaceholder description="No template displayed" />
                  </div>
                )}
              </main>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default PdfEditorPage;
