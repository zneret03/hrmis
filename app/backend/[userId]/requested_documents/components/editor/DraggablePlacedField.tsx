// components/editor/DraggablePlacedField.tsx

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PlacedField, PlacedFieldDragData } from '@/lib/types/DraggableTypes';

interface DraggablePlacedFieldProps {
  field: PlacedField;
  onUpdate: (id: string, value: string) => void;
}

export function DraggablePlacedField({
  field,
  onUpdate,
}: DraggablePlacedFieldProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: field.id,
    data: {
      isPlacedField: true,
      fieldId: field.id,
    } as PlacedFieldDragData,
  });

  // This style prop IS REQUIRED for dynamic positioning and dragging.
  const style = {
    position: 'absolute' as const,
    left: field.x,
    top: field.y,
    width: field.width,
    height: field.height,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: 10, // Keep z-index to stay above the PDF canvas
  };

  const renderFieldType = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => onUpdate(field.id, e.target.value)}
            className="box-border h-full w-full border border-dashed border-gray-400 p-1 focus:border-blue-500 focus:outline-none"
            placeholder="Text Field"
          />
        );
      case 'signature':
        return (
          <div className="box-border flex h-full w-full cursor-pointer items-center justify-center border border-dashed border-blue-600 bg-blue-500/5 text-xs text-blue-600">
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
}
