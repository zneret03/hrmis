import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PlacedField, PlacedFieldDragData } from '@/lib/types/DraggableTypes';
import { NumberSize, Resizable } from 're-resizable';
import { Direction } from 're-resizable/lib/resizer';

interface DraggablePlacedFieldProps {
  field: PlacedField;
  onUpdate: (id: string, value: Partial<PlacedField> | string) => void;
}

function ResizeHandle() {
  return (
    <div
      className="absolute -right-2 -bottom-2 h-4 w-4 cursor-se-resize rounded-full border-2 border-white bg-blue-600"
      onPointerDown={(e) => e.stopPropagation()}
    />
  );
}

export function DraggablePlacedField({
  field,
  onUpdate,
}: DraggablePlacedFieldProps) {
  const signatureInputRef = React.useRef<HTMLInputElement>(null);

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

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    direction: Direction,
    ref: HTMLElement,
    d: NumberSize,
  ) => {
    onUpdate(field.id, {
      width: field.width + d.width,
      height: field.height + d.height,
    });
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const base64Data = loadEvent.target?.result as string;
      onUpdate(field.id, { value: base64Data });
    };
    reader.readAsDataURL(file);
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
              onPointerDown={(e) => e.stopPropagation()}
              onChange={(e) =>
                onUpdate(field.id, { checked: e.target.checked })
              }
              className="h-4/5 w-4/5" // Make checkbox fill most of the box
            />
          </div>
        );
      case 'signature':
        return (
          <>
            <div
              className="box-border flex h-full w-full cursor-pointer items-center justify-center border border-dashed border-blue-600 bg-blue-500/5 text-xs text-blue-600"
              onClick={() => signatureInputRef.current?.click()}
            >
              {field.value ? (
                <img
                  src={field.value}
                  alt="Signature"
                  className="h-full w-full object-contain"
                />
              ) : (
                'Click to Upload Signature'
              )}
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={signatureInputRef}
              className="hidden"
              onChange={handleSignatureUpload}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Resizable
        defaultSize={{
          width: field.width,
          height: field.height,
        }}
        onResizeStop={onResizeStop}
        enable={{
          bottomRight: true,
        }}
        handleComponent={{ bottomRight: <ResizeHandle /> }}
      >
        <div className="h-full w-full" style={{ cursor: 'move' }}>
          {renderFieldType()}
        </div>
      </Resizable>
    </div>
  );
}
