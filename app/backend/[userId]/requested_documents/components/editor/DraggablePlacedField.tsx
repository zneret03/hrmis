// components/editor/DraggablePlacedField.tsx

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PlacedField, PlacedFieldDragData } from '@/lib/types/DraggableTypes';

interface DraggablePlacedFieldProps {
  field: PlacedField;
  onUpdate: (id: string, value: Partial<PlacedField> | string) => void;
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

  const style = {
    position: 'absolute' as const,
    left: field.x,
    top: field.y,
    width: field.width,
    height: field.height,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: 10,
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

      case 'textarea':
        return (
          <textarea
            value={field.value || ''}
            onChange={(e) => onUpdate(field.id, e.target.value)}
            className="box-border h-full w-full resize-none border border-dashed border-gray-400 p-1 focus:border-blue-500 focus:outline-none"
            placeholder="Text Area"
          />
        );

      case 'checkbox':
        return (
          <div className="box-border flex h-full w-full items-center justify-center border border-dashed border-gray-400">
            <input
              type="checkbox"
              checked={field.checked || false}
              onChange={(e) =>
                onUpdate(field.id, { checked: e.target.checked })
              }
              className="h-4/5 w-4/5" // Make checkbox fill most of the box
            />
          </div>
        );
      // case 'signature':
      //   return (
      //     <div
      //       onClick={() =>
      //         onUpdate(field.id, { value: field.value ? '' : 'Signed' })
      //       }
      //       onPointerDown={(e) => e.stopPropagation()}
      //       className="box-border flex h-full w-full cursor-pointer items-center justify-center border border-dashed border-blue-600 bg-blue-500/5 text-xs text-blue-600"
      //     >
      //       {field.value ? `Signed` : 'Click to Sign'}
      //     </div>
      //   );
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
