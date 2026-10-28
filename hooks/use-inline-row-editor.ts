import * as React from 'react';

export type InlineRowMode =
  | { kind: 'idle' }
  | { kind: 'add' }
  | { kind: 'edit'; id: string }
  | { kind: 'delete'; id: string };

/**
 * State for a table edited in place: at most one row at a time is being added,
 * edited, or confirmed for deletion. `draft` holds that row's input values.
 */
export function useInlineRowEditor<TDraft extends object>(
  emptyDraft: () => TDraft,
) {
  const [mode, setMode] = React.useState<InlineRowMode>({ kind: 'idle' });
  const [draft, setDraft] = React.useState<TDraft>(emptyDraft);
  const [isDirty, setIsDirty] = React.useState(false);

  const startAdd = () => {
    setDraft(emptyDraft());
    setIsDirty(false);
    setMode({ kind: 'add' });
  };

  const startEdit = (id: string, values: TDraft) => {
    setDraft(values);
    setIsDirty(false);
    setMode({ kind: 'edit', id });
  };

  const startDelete = (id: string) => setMode({ kind: 'delete', id });

  const reset = () => {
    setMode({ kind: 'idle' });
    setDraft(emptyDraft());
    setIsDirty(false);
  };

  const setField = <K extends keyof TDraft>(field: K, value: TDraft[K]) => {
    setIsDirty(true);
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  return {
    mode,
    draft,
    isDirty,
    isIdle: mode.kind === 'idle',
    isEditing: (id: string) => mode.kind === 'edit' && mode.id === id,
    isDeleting: (id: string) => mode.kind === 'delete' && mode.id === id,
    startAdd,
    startEdit,
    startDelete,
    setField,
    reset,
  };
}
