export type FieldType = 'text' | 'signature' | 'checkbox' | 'textarea';

export interface PlacedField {
  id: string;
  type: FieldType;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string;
  checked?: boolean;
}

export interface ToolboxDragData {
  isToolboxItem: true;
  type: FieldType;
  width: number;
  height: number;
}

export interface PlacedFieldDragData {
  isPlacedField: true;
  fieldId: string;
}
