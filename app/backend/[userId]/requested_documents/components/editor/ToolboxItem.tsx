'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FieldType, ToolboxDragData } from '@/lib/types/DraggableTypes';

interface ToolboxItemProps {
  type: FieldType;
  width: number;
  height: number;
}

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

  // Dynamic transform style must stay inline
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const classes = [
    'py-2',
    'px-4',
    'bg-gray-100',
    'border',
    'border-gray-300',
    'rounded',
    'cursor-grab',
    'select-none',
    'my-1',
    isDragging ? 'z-50 opacity-80 shadow-lg' : 'opacity-100', // Conditional classes
  ].join(' ');

  return (
    <div
      ref={setNodeRef}
      className={classes}
      style={style}
      {...listeners}
      {...attributes}
    >
      Drag: {type}
    </div>
  );
}
