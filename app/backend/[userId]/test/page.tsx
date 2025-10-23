'use client';

import type { NextPage } from 'next';
import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// --- PDF Rendering ---
// We need to import the Document and Page components, and set up the worker
import { Document, Page, pdfjs } from 'react-pdf';

// This line is CRUCIAL for Next.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// --- Drag and Drop ---
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

// --- PDF Modification ---
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// --- Type Definitions ---

type FieldType = 'text' | 'signature';

// This is our single source of truth for a field placed on the PDF
interface PlacedField {
  id: string;
  type: FieldType;
  page: number;
  // Coordinates are relative to the top-left of the PDF page
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string; // For text inputs
}

// Data passed when dragging from the toolbox
interface ToolboxDragData {
  isToolboxItem: true;
  type: FieldType;
  width: number;
  height: number;
}

// Data passed when dragging an existing field
interface PlacedFieldDragData {
  isPlacedField: true;
  fieldId: string;
}

// --- React Components ---

/**
 * ## ToolboxItem
 * A single draggable item in the sidebar toolbox.
 */
const ToolboxItem: React.FC<{
  type: FieldType;
  width: number;
  height: number;
}> = ({ type, width, height }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `toolbox-${type}`,
    data: {
      isToolboxItem: true,
      type,
      width,
      height,
    } as ToolboxDragData,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        opacity: 0.8,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        padding: '10px 15px',
        backgroundColor: '#eee',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'grab',
        userSelect: 'none',
        margin: '5px 0',
      }}
      {...listeners}
      {...attributes}
    >
      Drag: {type}
    </div>
  );
};

/**
 * ## Toolbox
 * The sidebar containing all draggable field types.
 */
const Toolbox: React.FC = () => {
  return (
    <div
      style={{
        width: '200px',
        padding: '15px',
        borderRight: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h3>Toolbox</h3>
      <ToolboxItem type="text" width={150} height={30} />
      <ToolboxItem type="signature" width={150} height={50} />
    </div>
  );
};

/**
 * ## DraggablePlacedField
 * A field that has already been dropped onto the PDF canvas.
 * It's draggable (for repositioning) and renders the appropriate input.
 */

const DraggablePlacedField: React.FC<{
  field: PlacedField;
  onUpdate: (id: string, value: string) => void;
}> = ({ field, onUpdate }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
    data: {
      isPlacedField: true,
      fieldId: field.id,
    } as PlacedFieldDragData,
  });

  const style = {
    position: 'absolute' as const,
    left: field.x,
    top: field.y,
    width: field.width,
    height: field.height,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: 10, // Above the PDF canvas
  };

  const renderFieldType = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => onUpdate(field.id, e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              height: '100%',
              border: '1px dashed #999',
              boxSizing: 'border-box',
            }}
            placeholder="Text Field"
          />
        );
      case 'signature':
        return (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              height: '100%',
              border: '1px dashed #00f',
              backgroundColor: 'rgba(0, 0, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              fontSize: '0.8rem',
              color: '#00f',
              cursor: 'pointer',
            }}
          >
            {field.value ? `Signed` : 'Click to Sign'}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {renderFieldType()}
    </div>
  );
};

/**
 * ## PdfPageDroppable
 * Renders a single PDF page and acts as a drop zone for new fields.
 */
const PdfPageDroppable: React.FC<{
  pageNumber: number;
  fields: PlacedField[];
  onFieldUpdate: (id: string, value: string) => void;
  onPageLoad: (page: any) => void;
}> = ({ pageNumber, fields, onFieldUpdate, onPageLoad }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `pdf-page-${pageNumber}`,
  });

  const fieldsOnThisPage = fields.filter((f) => f.page === pageNumber);

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        border: isOver ? '2px dashed #007bff' : '1px solid #ccc',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '20px',
      }}
    >
      <Page pageNumber={pageNumber} onLoadSuccess={onPageLoad} />

      {/* Render all fields for this page */}
      {fieldsOnThisPage.map((field) => (
        <DraggablePlacedField
          key={field.id}
          field={field}
          onUpdate={onFieldUpdate}
        />
      ))}
    </div>
  );
};

/**
 * # PdfEditorPage (Main Component)
 * The primary Next.js page component that orchestrates the entire application.
 */
const PdfEditorPage: NextPage = () => {
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
    // Store the *native* PDF dimensions for this page
    setPageDimensions((prev) => {
      const newDims = [...prev];
      newDims[pageIndex] = { width: page.width, height: page.height };
      return newDims;
    });
  };

  const handleFieldUpdate = (id: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  /**
   * ## handleDragEnd
   * This is the core dnd-kit logic. It fires when a drag operation finishes.
   */

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    const dragData = active.data.current as
      | PlacedFieldDragData
      | ToolboxDragData;

    // --- Case 1: Repositioning an existing field ---
    if (dragData.isPlacedField) {
      const fieldId = active.id;

      // --- SUCCESS CASE ---
      // Check if it was dropped on a valid page droppable
      if (over && over.id.toString().startsWith('pdf-page-')) {
        const pageNumber = parseInt(over.id.toString().split('-')[2], 10);

        setFields((prevFields) =>
          prevFields.map((field) => {
            if (field.id === fieldId) {
              // Update position with the delta (drag movement)
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

      // This 'return' is important to stop 'Case 2' from running
      return;
    }

    // --- Case 2: Dropping a *new* field from the toolbox ---
    if (dragData.isToolboxItem && over) {
      const pageId = over.id.toString();
      if (!pageId.startsWith('pdf-page-')) {
        return; // Not dropped on a valid page
      }

      const pageNumber = parseInt(pageId.split('-')[2], 10);
      const pageRect = over.rect;
      const dropX = (event.activatorEvent as MouseEvent).clientX;
      const dropY = (event.activatorEvent as MouseEvent).clientY;

      let x = dropX - pageRect.left;
      let y = dropY - pageRect.top;

      // Center the new field on the cursor
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

  /**
   * ## handleSave
   * Uses pdf-lib to embed the fields into the PDF and trigger a download.
   */
  const handleSave = async () => {
    if (!pdfFile) {
      alert('Please load a PDF first.');
      return;
    }

    try {
      // Load the original PDF into pdf-lib
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();

      for (const field of fields) {
        const page = pages[field.page - 1]; // pageNumber is 1-based, array is 0-based
        if (!page) continue;

        // Get the *native* dimensions for this page
        const pageDims = pageDimensions[field.page - 1];
        const pageHeight = pageDims.height || page.getHeight();

        // ** THE CRITICAL COORDINATE CONVERSION **
        // pdf-lib's (0,0) is at the BOTTOM-LEFT.
        // Our React state's (0,0) is at the TOP-LEFT.
        //
        // pdf_y = page_height - react_y - field_height
        const pdfY = pageHeight - field.y - field.height;
        const pdfX = field.x;

        // Draw the value directly onto the page ("flattening")
        // This is simpler than creating interactive AcroForms
        page.drawText(field.value || '', {
          x: pdfX + 5, // Small padding
          y: pdfY + field.height / 2 - 6, // Vertically center approx
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });

        // Optionally, draw a border to show where the field was
        page.drawRectangle({
          x: pdfX,
          y: pdfY,
          width: field.width,
          height: field.height,
          borderWidth: 1,
          borderColor: rgb(0.5, 0.5, 0.5),
          opacity: 0.5,
        });
      }

      // Save the modified PDF bytes
      const pdfBytes = await pdfDoc.save();

      // Trigger a download
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

  // --- Render ---

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div
        style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}
      >
        {/* Top Bar */}
        <div
          style={{
            padding: '10px 15px',
            borderBottom: '1px solid #ddd',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <h2>PDF Field Editor (Next.js + dnd-kit)</h2>
          <div>
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
            />
            <button
              onClick={handleSave}
              disabled={fields.length === 0}
              style={{
                marginLeft: '10px',
                padding: '8px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Save PDF
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Toolbox />

          {/* PDF Canvas Area */}
          <div
            ref={pdfCanvasContainerRef}
            style={{
              flexGrow: 1,
              overflow: 'auto', // Make the canvas area scrollable
              padding: '20px',
              backgroundColor: '#e9e9e9',
            }}
          >
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
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default PdfEditorPage;
