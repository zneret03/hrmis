import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useInlineRowEditor } from '@/hooks/use-inline-row-editor';

const emptyDraft = () => ({ position: '', status: '' });

const setup = () => renderHook(() => useInlineRowEditor(emptyDraft));

describe('useInlineRowEditor', () => {
  it('starts idle with an empty, clean draft', () => {
    const { result } = setup();
    expect(result.current.mode).toEqual({ kind: 'idle' });
    expect(result.current.isIdle).toBe(true);
    expect(result.current.draft).toEqual(emptyDraft());
    expect(result.current.isDirty).toBe(false);
  });

  it('adds a row and tracks edits as dirty', () => {
    const { result } = setup();
    act(() => result.current.startAdd());
    expect(result.current.mode).toEqual({ kind: 'add' });
    expect(result.current.isDirty).toBe(false);

    act(() => result.current.setField('position', 'Clerk'));
    expect(result.current.draft.position).toBe('Clerk');
    expect(result.current.isDirty).toBe(true);
  });

  it('edits one row with its current values', () => {
    const { result } = setup();
    act(() =>
      result.current.startEdit('r1', { position: 'Clerk', status: 'Casual' }),
    );
    expect(result.current.isEditing('r1')).toBe(true);
    expect(result.current.isEditing('r2')).toBe(false);
    expect(result.current.draft).toEqual({
      position: 'Clerk',
      status: 'Casual',
    });
    expect(result.current.isDirty).toBe(false);
  });

  it('confirms deletion for one row', () => {
    const { result } = setup();
    act(() => result.current.startDelete('r1'));
    expect(result.current.isDeleting('r1')).toBe(true);
    expect(result.current.isDeleting('r2')).toBe(false);
    expect(result.current.isIdle).toBe(false);
  });

  it('resets back to idle with a clean draft', () => {
    const { result } = setup();
    act(() => result.current.startAdd());
    act(() => result.current.setField('position', 'Clerk'));
    act(() => result.current.reset());
    expect(result.current.isIdle).toBe(true);
    expect(result.current.draft).toEqual(emptyDraft());
    expect(result.current.isDirty).toBe(false);
  });
});
