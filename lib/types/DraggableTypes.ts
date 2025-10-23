export type FieldType = 'text' | 'signature';

// This is our single source of truth for a field placed on the PDF
export interface PlacedField {
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
export interface ToolboxDragData {
  isToolboxItem: true;
  type: FieldType;
  width: number;
  height: number;
}

// Data passed when dragging an existing field
export interface PlacedFieldDragData {
  isPlacedField: true;
  fieldId: string;
}
