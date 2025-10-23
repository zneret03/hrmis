// components/editor/PdfPageDroppable.tsx

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Page } from 'react-pdf';
import { PlacedField } from '@/lib/types/DraggableTypes';
import { DraggablePlacedField } from './DraggablePlacedField';

interface PdfPageDroppableProps {
  pageNumber: number;
  fields: PlacedField[];
  onFieldUpdate: (id: string, value: string) => void;
  onPageLoad: (page: any) => void;
}

export function PdfPageDroppable({
  pageNumber,
  fields,
  onFieldUpdate,
  onPageLoad,
}: PdfPageDroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `pdf-page-${pageNumber}`,
  });

  const fieldsOnThisPage = fields.filter((f) => f.page === pageNumber);

  const classes = [
    'relative',
    'shadow-lg',
    'mb-5',
    isOver
      ? 'border-2 border-dashed border-blue-500' // Drop active
      : 'border border-gray-300', // Default
  ].join(' ');

  return (
    <div ref={setNodeRef} className={classes}>
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
}
