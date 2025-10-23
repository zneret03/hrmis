'use client';

import React, { useState, useRef, JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Document, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

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

export function PdfEditorPage(): JSX.Element {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageDimensions, setPageDimensions] = useState<
    { width: number; height: number }[]
  >([]);
  const [fields, setFields] = useState<PlacedField[]>([]);
  const pdfCanvasContainerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

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

  const onPageLoadSuccess = (pageIndex: number, page: any) => {
    setPageDimensions((prev) => {
      const newDims = [...prev];
      newDims[pageIndex] = { width: page.width, height: page.height };
      return newDims;
    });
  };

  const handleFieldUpdate = (id: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
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
        const scaledY_topDown = field.y * scale;
        const scaledHeight = field.height * scale;

        const pdfY = pageHeight - scaledY_topDown - scaledHeight;

        const pdfX = scaledX;

        page.drawText(field.value || '', {
          x: pdfX + 5,
          y: pdfY + 3,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modified-${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error saving PDF:', err);
      console.info(pageDimensions);
      alert('An error occurred while saving the PDF.');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="flex h-screen flex-col">
        {/* Top Bar */}
        <div className="flex flex-shrink-0 items-center justify-end border-b border-gray-300 bg-white px-4 py-3">
          <div>
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
            />
            <button
              onClick={handleSave}
              disabled={!pdfFile || fields.length === 0}
              className="ml-3 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save PDF
            </button>
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          <Toolbox />

          <div></div>
          <div
            ref={pdfCanvasContainerRef}
            className="flex-grow overflow-auto bg-gray-200 p-5"
          >
            {pdfFile ? (
              <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
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
                Please select a PDF file to begin.
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default PdfEditorPage;
