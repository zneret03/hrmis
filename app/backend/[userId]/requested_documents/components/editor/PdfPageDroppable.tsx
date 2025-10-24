import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Page } from 'react-pdf';
import { PlacedField } from '@/lib/types/DraggableTypes';
import { DraggablePlacedField } from './DraggablePlacedField';
import { PageCallback } from 'react-pdf/dist/shared/types.js';

interface PdfPageDroppableProps {
  pageNumber: number;
  fields: PlacedField[];
  onFieldUpdate: (id: string, newProps: Partial<PlacedField> | string) => void;
  onPageLoad: (page: PageCallback) => void;
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
      ? 'border-2 border-dashed border-blue-500'
      : 'border border-gray-300',
  ].join(' ');

  return (
    <div ref={setNodeRef} className={classes}>
      <Page pageNumber={pageNumber} onLoadSuccess={onPageLoad} width={1200} />

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
