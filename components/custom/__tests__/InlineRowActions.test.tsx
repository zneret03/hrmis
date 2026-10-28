import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InlineRowActions } from '@/components/custom/InlineRowActions';

const button = (name: string) => screen.getByRole('button', { name });

describe('InlineRowActions', () => {
  it('view: edit and delete trigger their handlers', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <InlineRowActions state="view" onEdit={onEdit} onDelete={onDelete} />,
    );
    fireEvent.click(button('Edit entry'));
    fireEvent.click(button('Delete entry'));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it('view: disabled while another row is busy', () => {
    render(<InlineRowActions state="view" disabled />);
    expect(button('Edit entry')).toBeDisabled();
    expect(button('Delete entry')).toBeDisabled();
  });

  it('editing: Save appears only once the row is dirty', () => {
    const { rerender } = render(<InlineRowActions state="editing" />);
    expect(screen.queryByRole('button', { name: 'Save entry' })).toBeNull();
    expect(button('Cancel')).toBeEnabled();

    const onSave = vi.fn();
    rerender(<InlineRowActions state="editing" isDirty onSave={onSave} />);
    fireEvent.click(button('Save entry'));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it('editing: Save is disabled when the row is invalid or saving', () => {
    const { rerender } = render(
      <InlineRowActions state="editing" isDirty canSave={false} />,
    );
    expect(button('Save entry')).toBeDisabled();

    rerender(<InlineRowActions state="editing" isDirty isPending />);
    expect(button('Save entry')).toBeDisabled();
    expect(button('Cancel')).toBeDisabled();
  });

  it('confirm-delete: asks inline, then confirms or cancels', () => {
    const onConfirmDelete = vi.fn();
    const onCancel = vi.fn();
    render(
      <InlineRowActions
        state="confirm-delete"
        onConfirmDelete={onConfirmDelete}
        onCancel={onCancel}
      />,
    );
    expect(screen.getByText('Delete?')).toBeInTheDocument();
    fireEvent.click(button('Confirm delete'));
    fireEvent.click(button('Cancel'));
    expect(onConfirmDelete).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
