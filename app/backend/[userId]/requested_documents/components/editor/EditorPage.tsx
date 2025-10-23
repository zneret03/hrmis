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

    if (dragData.isPlacedField) {
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

    if (dragData.isToolboxItem && over) {
      const pageId = over.id.toString();
      if (!pageId.startsWith('pdf-page-')) return;

      const pageNumber = parseInt(pageId.split('-')[2], 10);
      const pageRect = over.rect;
      const dropX = (event.activatorEvent as MouseEvent).clientX;
      const dropY = (event.activatorEvent as MouseEvent).clientY;

      let x = dropX - pageRect.left;
      let y = dropY - pageRect.top;
      x -= dragData.width / 2;
      y -= dragData.height / 2;

      const newField: PlacedField = {
        id: uuidv4(),
        type: dragData.type,
        page: pageNumber,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: dragData.width,
        height: dragData.height,
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
        const page = pages[field.page - 1]; // pageNumber is 1-based
        if (!page) continue;

        // --- THIS IS THE CORRECTED SCALING LOGIC ---

        // 1. Get native page dimensions from pdf-lib
        const pageDims = pageDimensions[field.page - 1];
        const pageHeight = pageDims.height || page.getHeight();
        const nativeWidth = pageDims.width || page.getWidth();

        // 2. Define our render width
        const renderWidth = 1500;

        // 3. Calculate the scale factor
        //    (e.g., native 612pt / render 1500px = 0.408)
        const scale = nativeWidth / renderWidth;

        // 4. Scale all our render-space coordinates (from dnd-kit)
        //    back into native PDF-space (points).
        const pdfX = field.x * scale;
        const pdfY_topDown = field.y * scale;
        const pdfFieldHeight = field.height * scale;
        const pdfFieldWidth = field.width * scale;

        // 5. Convert Y-coordinate from top-left (React)
        //    to bottom-left (PDF).
        const pdfY = pageHeight - pdfY_topDown - pdfFieldHeight;

        const fontSize = 50; // Our target font size

        page.drawText(field.value || '', {
          x: pdfX + 5 * scale,
          y: pdfY + pdfFieldHeight / 2 - fontSize / 2,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        // --- END OF FIX ---

        // Draw the box (also in scaled, native coordinates)
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: pdfFieldWidth,
          height: pdfFieldHeight,
          borderWidth: 1,
          borderColor: rgb(0.5, 0.5, 0.5),
          opacity: 0.5,
        });
      }

      // Save and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
