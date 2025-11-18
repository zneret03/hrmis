'use client';

import React, { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Pencil, Check, PencilLine, Signature, Image } from 'lucide-react';
import { FieldType, ToolboxDragData } from '@/lib/types/DraggableTypes';

interface ToolboxItemProps {
  type: FieldType;
  width: number;
  height: number;
}

const tooltBoxItems: { [key: string]: ReactNode } = {
  text: (
    <div className="flex items-center gap-2">
      <Pencil className="h-4 w-4" />
      <span className="font-medium">Text Field</span>
    </div>
  ),
  textarea: (
    <div className="flex items-center gap-2">
      <PencilLine className="h-4 w-4" />
      <span className="font-medium">Text Area</span>
    </div>
  ),
  checkbox: (
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4" />
      <span className="font-medium">Checkbox</span>
    </div>
  ),
  signature: (
    <div className="flex items-center gap-2">
      <Signature className="h-4 w-4" />
      <span className="font-medium">Signature</span>
    </div>
  ),
  image: (
    <div className="flex items-center gap-2">
      <Image className="h-4 w-4" />
      <span className="font-medium">Image</span>
    </div>
  ),
};

export function ToolboxItem({ type, width, height }: ToolboxItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `toolbox-${type}`,
      data: {
        isToolboxItem: true,
        type,
        width,
        height,
      } as ToolboxDragData,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const classes = [
    'py-2',
    'px-4',
    'bg-gray-100',
    'border',
    'border-blue-300',
    'rounded',
    'cursor-grab',
    'select-none',
    'my-1',
    isDragging ? 'z-50 opacity-80 shadow-lg' : 'opacity-100',
  ].join(' ');

  return (
    <div
      ref={setNodeRef}
      className={classes}
      style={style}
      {...listeners}
      {...attributes}
    >
      {tooltBoxItems[type]}
    </div>
  );
}
